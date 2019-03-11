var useEnv = process.env['CG_CONFIG'] != undefined;
var configs = useEnv ? JSON.parse(process.env['CG_CONFIG']) : require('./config/config');
var CoastGuard = require('./lib/coast-guard').CoastGuard;

process.env['APP_NAME'] = configs.app.name;
if (!useEnv) {
    // Ignore SSL cert errors
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
if (process.env['STOP'] === 'YES') {
    return;
}

console.log('Running once');
runTests();

function runTests(i) {
    if (i === undefined) {
        i = 0;
    }
    if (i == configs.subscribers.length) {
        return;
    }
    var isLast = i === configs.subscribers.length - 1;
    runTest(i, isLast).then(function() {
        runTests(i+1);
    });
}

function runTest(i, isLast) {
    var config = configs.subscribers[i];
    config.isLast = isLast;
    var cg = new CoastGuard(config, configs.mailer, {notification_email: configs.notification_email});
    return cg.runAllTests();
}