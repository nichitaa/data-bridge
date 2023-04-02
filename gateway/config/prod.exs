import Config

# General configs
config :gateway,
  auth_service_base_url: "http://auth_service",
  main_api_service_base_url: "http://main_api",
  db_api_service_base_url: "http://connector-service"

# Do not print debug messages in production
config :logger, level: :info
