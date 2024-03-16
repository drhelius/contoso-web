import { ChatTurn, GroundedMessage } from "./types";

export const sendGroundedMessage = async (
  turn: ChatTurn
): Promise<ChatTurn> => {
  const message = [
    {
      role: turn.type === "user" ? "user" : "assistant",
      content: turn.message,
    },
  ];

  console.log(message);

  const response = await fetch("/api/chat/grounded", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = (await response.json()) as GroundedMessage;
  console.log(data);

  const newTurn: ChatTurn = {
    name: "Jane Doe",
    message: data.message,
    status: "done",
    type: "assistant",
    avatar: "",
    image: null,
  };

  return newTurn;
};

export const sendPromptFlowMessage = async (
  turn: ChatTurn,
  customerId: string = "4" // Sarah Lee is Customer 4
): Promise<ChatTurn> => {
  const body = {
    chat_history: [],
    question: turn.message,
    customerId: customerId.toString(),
  };

  console.log(body);

  const response = await fetch("/api/chat/promptflow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(data);

  const newTurn: ChatTurn = {
    name: "Jane Doe",
    message: data["answer"],
    status: "done",
    type: "assistant",
    avatar: "",
    image: null,
  };

  return newTurn;
};

export const sendVisualMessage = async (
  turn: ChatTurn,
  customerId: string = "4" // Sarah Lee is Customer 4
): Promise<ChatTurn> => {

  let image_contents = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAX+XDSwAAAABJRU5ErkJggg==";

  if (turn.image) {
    image_contents = turn.image;
  }

  console.log(image_contents);

  const body = {
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant for an ecommerce website in a company named Contoso. This website sells outdoor apparel including tents. You are trained to interpret images about people and make responsible assumptions about them. You suggest products based on the image and the conversation. You can also answer questions about the products and the company.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: turn.message },
          { type: "image_url", image_url: { url: image_contents, detail: "high" } },
        ],
      },
    ],
  };

  console.log(body);

  const response = await fetch("/api/chat/visual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(data);

  const newTurn: ChatTurn = {
    name: "Jane Doe",
    message: data["choices"][0]["message"]["content"],
    status: "done",
    type: "assistant",
    avatar: "",
    image: null,
  };

  return newTurn;
};
