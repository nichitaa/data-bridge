import Config

# General configs
config :gateway,
  auth_service_base_url: "http://auth_service"

# Do not print debug messages in production
config :logger, level: :info
