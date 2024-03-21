module.exports = {
  apps: [
    {
      name: 'Admin',
      cwd: 'Admin',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3000',
      },
    },
    {
      name: 'Auth',
      cwd: 'Auth',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3001',
      },
    },
    {
      name: 'Client',
      cwd: 'Client',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3002',
      },
    },
    {
      name: 'external-apis',
      cwd: 'external-apis',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3003',
      },
    },
    {
      name: 'message-provider',
      cwd: 'message-provider',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3004',
      },
    },
    {
      name: 'Query',
      cwd: 'Query',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3005',
      },
    },
    {
      name: 'QueryDBWriter',
      cwd: 'QueryDBWriter',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3008',
      },
    },
    {
      name: 'Supplier',
      cwd: 'Supplier',
      script: './index.js',
      args: 'start',
      instances: '1',
      exec_mode: 'cluster',
      env: {
        API_PORT: '3006',
      },
    },
    {
      name: 'cron-job',
      script: 'cron.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cron_restart: '0 * * * *', // Ejecutar cada hora
    },
  ],
};
