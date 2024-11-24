export function request(ctx) {
  const { input } = ctx.args;
  return {
    resourcePath: "/knowledgebases/<your-knowledgeBase-id>/retrieve",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retrievalQuery: {
          text: input,
        },
      }),
    },
  };
}

export function response(ctx) {
  const responseBody = JSON.parse(ctx.result.body);
  const retrievalResults = responseBody.retrievalResults || [];

  const texts = retrievalResults.map(result => result.content.text);

  return JSON.stringify(texts);
}
