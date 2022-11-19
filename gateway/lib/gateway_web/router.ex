defmodule GatewayWeb.Router do
  use GatewayWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", GatewayWeb do
    pipe_through :api
    get "/health_check/env", HealthCheckController, :get_env

    # Authorization service routes
    scope "/auth" do
      post "/register", AuthController, :register
      post "/login", AuthController, :login
      get "/self", AuthController, :get_self
    end

    scope "/main" do
      get "/workspace", MainApiController, :list_workspaces
      get "/workspace/:workspace_id", MainApiController, :get_workspace_by_id
      post "/workspace", MainApiController, :create_workspace
      delete "/workspace/:workspace_id", MainApiController, :delete_workspace_by_id
      patch "/workspace/:workspace_id", MainApiController, :update_workspace_by_id
      post "/workspace/:workspace_id/collaborator/:collaborator_id", MainApiController, :add_collaborator
    end

    scope "/db" do
      post "/test_connection", DbApiController, :test_connection
    end
  end

  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: GatewayWeb.Telemetry
    end
  end
end
