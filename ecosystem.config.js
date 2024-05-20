module.exports = {
    apps : [
        {
            name: 'server-users',
            script: './server-users/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'server-devices',
            script: './server-devices/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
}
