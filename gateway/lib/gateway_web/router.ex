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
      ## Workspace API
      get "/workspaces", MainApiController, :list_workspaces
      get "/workspace/:workspace_id", MainApiController, :get_workspace_by_id
      post "/workspace", MainApiController, :create_workspace
      delete "/workspace/:workspace_id", MainApiController, :delete_workspace_by_id
      patch "/workspace/:workspace_id", MainApiController, :update_workspace_by_id
      ## Collaborator API
      post "/workspace/:workspace_id/collaborator/:email", MainApiController, :add_collaborator

      delete "/workspace/:workspace_id/collaborator/:email",
             MainApiController,
             :delete_collaborator

      post "/workspace/:workspace_id/collaborator/:email/update-role",
           MainApiController,
           :update_collaborator_role

      ## Resource API
      post "/workspace/:workspace_id/create-resource", MainApiController, :create_resource
      post "/workspace/:workspace_id/rename-resource", MainApiController, :rename_resource
      delete "/workspace/:workspace_id/delete-resource", MainApiController, :delete_resource
      ## Query API
      patch "/workspace/:workspace_id/query/:query_id", MainApiController, :update_query
    end

    scope "/db" do
      post "/test_connection", DbApiController, :test_connection
      post "/export_to_csv", DbApiController, :export_to_csv
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
