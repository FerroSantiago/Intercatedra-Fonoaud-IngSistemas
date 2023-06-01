const bridge_1 = require("./___now_bridge");
const http_1 = require("http");

const entrypointPath = "./src/app.js";
const shouldAddHelpers = true;
const helpersPath = "./___now_helpers";

const bridge = (function () {
        let bridge = new bridge_1.Bridge();
        let isServerListening = false;
        const originalListen = http_1.Server.prototype.listen;
        http_1.Server.prototype.listen = function listen() {
            isServerListening = true;
            console.log('Legacy server listening...');
            bridge.setServer(this);
            http_1.Server.prototype.listen = originalListen;
            bridge.listen();
            return this;
        };
        if (!process.env.NODE_ENV) {
            const region = process.env.VERCEL_REGION || process.env.NOW_REGION;
            process.env.NODE_ENV = region === 'dev1' ? 'development' : 'production';
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            let listener = require(entrypointPath);
            if (listener.default)
                listener = listener.default;
            if (typeof listener.listen === 'function') {
                http_1.Server.prototype.listen = originalListen;
                const server = listener;
                bridge.setServer(server);
                bridge.listen();
            }
            else if (typeof listener === 'function') {
                http_1.Server.prototype.listen = originalListen;
                let server;
                if (shouldAddHelpers) {
                    bridge = new bridge_1.Bridge(undefined, true);
                    server = require(helpersPath).createServerWithHelpers(listener, bridge);
                }
                else {
                    server = http_1.createServer(listener);
                }
                bridge.setServer(server);
                bridge.listen();
            }
            else if (typeof listener === 'object' &&
                Object.keys(listener).length === 0) {
                setTimeout(() => {
                    if (!isServerListening) {
                        console.error('No exports found in module %j.', entrypointPath);
                        console.error('Did you forget to export a function or a server?');
                        process.exit(1);
                    }
                }, 5000);
            }
            else {
                console.error('Invalid export found in module %j.', entrypointPath);
                console.error('The default export must be a function or server.');
            }
        }
        catch (err) {
            if (err.code === 'MODULE_NOT_FOUND') {
                console.error(err.message);
                console.error('Did you forget to add it to "dependencies" in `package.json`?');
            }
            else {
                console.error(err);
            }
            process.exit(1);
        }
        return bridge;
    })();
exports.launcher = bridge.launcher;