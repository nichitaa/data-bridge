import Config

config :gateway, GatewayWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 9999],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "Mh1ENB0Sqa/QHLUx1umXWvnvmBNayZxBWucJR5kTGJKonJxXzMndIEYtvyYMJjhK",
  watchers: []

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime
