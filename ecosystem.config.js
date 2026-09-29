// PM2 Ecosystem configuration file
// Usage: pm2 start ecosystem.config.js

export default {
  apps: [
    {
      name: "lilsprouts",
      script: "server.js",
      cwd: "/root/new-lil-sprouts",
      instances: 1,
      exec_mode: "fork",
      env_file: ".env",
      env: {
        NODE_ENV: "production",
      },
      error_file: "/root/.pm2/logs/lilsprouts-error.log",
      out_file: "/root/.pm2/logs/lilsprouts-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
    },
  ],
};
