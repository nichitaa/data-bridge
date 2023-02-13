defmodule GatewayWeb.QueryChannel do
  use Phoenix.Channel, hibernate_after: :infinity

  intercept ["query_update"]

  def join("query:" <> query_id, params, socket) do
    user_id = socket.assigns.user_id
    socket = assign(socket, :query_id, query_id)
    dbg("[query] join user: #{user_id}, query_id: #{query_id}")
    {:ok, %{success: true}, socket}
  end

  ## Incoming

  def handle_in("update", params, socket) do
    query_id = socket.assigns.query_id
    dbg("[query]-[update] for query=#{query_id} params=#{inspect(params)}")
    broadcast!(socket, "query_update", params)
    {:reply, {:ok, %{success: true}}, socket}
  end

  ## Outgoing

  def handle_out("query_update", payload, socket) do
    dbg("[query]-[OUT]-[query_update] payload=#{inspect(payload)}")
    # TODO: push only to users different from one that emitted on update event
    push(socket, "query_update", payload)
    {:noreply, socket}
  end

  def terminate(reason, socket) do
    dbg("[query]-[terminate] reason=#{inspect(reason)}")
    :ok
  end
end
