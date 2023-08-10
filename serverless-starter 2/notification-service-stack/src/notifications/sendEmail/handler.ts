export const handler = async (event) => {
  try {
    console.log("I am inhandler");
    const data = event.Records[0];
    console.log({ data });

    await sendEmail(data.body);

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

async function sendEmail(userData: any) {
  const sesParams = {
    Source: "hassan.udyh@gmail.com",
    Destination: {
      ToAddresses: [userData.email],
    },
    Message: {
      Subject: {
        Data: "Welcome to our app!",
      },
      Body: {
        Text: {
          Data: `Hello ${userData.name},\n\nWelcome to our app!`,
        },
      },
    },
  };
  console.log("I am in email");
  console.log({ sesParams });
  // await ses.send(new SendEmailCommand(sesParams));
}
