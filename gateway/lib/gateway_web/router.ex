defmodule GatewayWeb.Router do
  use GatewayWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", GatewayWeb do
    pipe_through :api
    get "/health_check/env", HealthCheckController, :get_env
  end

  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: GatewayWeb.Telemetry
    end
  end
end
