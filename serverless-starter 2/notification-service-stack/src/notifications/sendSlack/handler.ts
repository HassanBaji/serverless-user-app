export const handler = async (event) => {
  try {
    console.log("I am inhandler");

    const data = event.Records[0];

    await sendSlackMessage(data.body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Messages processed successfully" }),
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error processing messages", error }),
    };
  }
};

async function sendSlackMessage(userData: any) {
  console.log({ userData });
}
