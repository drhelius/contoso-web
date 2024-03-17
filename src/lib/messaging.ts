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

  const body = {
    max_tokens: 1000,
    temperature: 0,
    top_p: 1,
    enhancements: {
      ocr: {
        enabled: true,
      },
      grounding: {
        enabled: true,
      },
    },
    dataSources: [
      {
        type: "AzureCognitiveSearch",
        parameters: {
          endpoint: "",
          key: "",
          indexName: "",
        },
      },
    ],
    messages: [
      {
        role: "system",
        content: "You are an AI assistant for the Contoso Outdoors product information that helps people find information in the shortest amount of text possible. Be brief and concise in your response and include emojis",
      },
      {
        role: "user",
        content: [
          { type: "text", text: turn.message },
          { type: "image_url", image_url: { url: turn.image, detail: "high" } },
        ],
      },
    ],
  };

  if (!turn.image) {
    const arr = body.messages[1].content;
    if (Array.isArray(arr))
    {
      body.messages[1].content = arr.filter(item => item.type !== "image_url");
    }
  }

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
