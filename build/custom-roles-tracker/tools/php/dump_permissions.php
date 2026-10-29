<?php
/**
 * Custom Roles & Permissions Evolution Tracker — permission dumper.
 *
 * Loads the product's OWN permission classes from a NAMED COMMIT (never the working tree) and
 * prints them as JSON. Every class is read with `git show <commit>:api/src/<path>.php`, so the
 * answer is exactly what that release shipped.
 *
 *   php dump_permissions.php <repo-path> <commit>
 *
 * Exit 0 with JSON on stdout. Anything that cannot be loaded at that commit is reported in
 * "unavailable" instead of failing the whole dump - an older release may not have a class yet.
 */
declare(strict_types=1);
[$_, $repo, $commit] = $argv + [null, null, null];
if (!$repo || !$commit) { fwrite(STDERR, "usage: dump_permissions.php <repo> <commit>\n"); exit(2); }
$tmp = sys_get_temp_dir() . '/crp-dump-' . bin2hex(random_bytes(4));
mkdir($tmp);
register_shutdown_function(function () use ($tmp) { exec('rm -rf ' . escapeshellarg($tmp)); });

spl_autoload_register(function (string $class) use ($repo, $commit, $tmp) {
    if (!str_starts_with($class, 'App\\')) { return; }
    $rel = 'api/src/' . str_replace('\\', '/', substr($class, 4)) . '.php';
    $src = shell_exec('git -C ' . escapeshellarg($repo) . ' show ' . escapeshellarg($commit . ':' . $rel) . ' 2>/dev/null');
    if (!is_string($src) || $src === '') { return; }
    $file = $tmp . '/' . md5($rel) . '.php';
    file_put_contents($file, $src);
    require $file;
});

$out = ['commit' => $commit, 'unavailable' => [], 'php' => PHP_VERSION];
$try = function (string $label, callable $fn) use (&$out) {
    try { $out[$label] = $fn(); }
    catch (\Throwable $e) { $out['unavailable'][$label] = get_class($e) . ': ' . $e->getMessage(); }
};
$enumCases = function (string $enum): array {
    $r = [];
    foreach ($enum::cases() as $c) { $r[$c->name] = $c instanceof \BackedEnum ? $c->value : $c->name; }
    return $r;
};
$val = fn($v) => $v instanceof \BackedEnum ? $v->value : $v;

$try('bundles', fn() => $enumCases('App\\Auth\\Domain\\Model\\FEPermissionEnum'));
$try('accounting_hub_bundles', fn() => array_map($val,
    \App\Auth\Domain\Model\FEPermissionEnum::accountingHubBundles()));
$try('default_role_names', fn() => $enumCases('App\\Auth\\Domain\\Model\\DefaultRoleNameEnum'));
$try('role_templates', fn() => $enumCases('App\\Auth\\Domain\\Model\\RoleTemplateEnum'));
$try('role_defaults', fn() => \App\Auth\UI\Cli\Command\RoleFePermissionMappings::getMappings());
$try('bundle_atoms', function () use ($val) {
    $r = [];
    foreach (\App\Auth\UI\Cli\OneOff\Mapping\FEPermissionMappings::getMappings() as $e) {
        $r[$val($e['code'])] = array_values(array_map($val, $e['permissions']));
    }
    return $r;
});
$try('cascade_implied_parents', fn() => (new \ReflectionClassConstant(
    'App\\Auth\\Domain\\Model\\FEPermissionCascade', 'IMPLIED_PARENTS'))->getValue());
$try('atoms', fn() => (new \ReflectionClass('App\\IAM\\AccessControl\\Domain\\PermissionEnum'))->getConstants());
$try('intentional_atom_changes', function () {
    $r = [];
    foreach ((new \ReflectionClass('App\\IAM\\AccessControl\\Application\\AtomResolution\\IntentionalAtomChanges'))->getConstants() as $k => $v) {
        $r[$k] = $v;
    }
    return $r;
});
$try('uneditable_templates', fn() => array_map($val, \App\Auth\Domain\Model\Role::getUneditableTemplates()));
$try('clock_capable_templates', fn() => array_map($val, \App\Auth\Domain\Model\Role::getClockCapableTemplates()));
$try('office_editable_permissions', fn() => \App\Auth\Domain\Model\Role::getOfficeEditableFEPermissions());
echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
