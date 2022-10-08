defmodule Gateway.Application do
  @moduledoc false

  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    children = [
      # HTTP client
      {Finch, name: FinchClient},
      GatewayWeb.Telemetry,
      {Phoenix.PubSub, name: Gateway.PubSub},
      GatewayWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Gateway.Supervisor]
    Logger.info("[Phoenix-Gateway] Application Starting in MIX_ENV=#{inspect(Mix.env())}")
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    GatewayWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
