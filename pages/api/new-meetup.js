//api/new-meetup
import { MongoClient } from "mongodb";

const handler = async (request, response) => {
  if (request.method === "POST") {
    const data = request.body;
    const client = await MongoClient.connect(
      "mongodb+srv://root:rnP7qFHmLfGkeEBK@cluster0.5juoc.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const dataBase = client.db();
    const meetupsCollection = dataBase.collection("meetup");
    const result = await meetupsCollection.insertOne(JSON.parse(data));
    console.log(result);
    client.close();
    response.status(201).json({ message: "Meetup Inserted" });
  }
};

export default handler;
