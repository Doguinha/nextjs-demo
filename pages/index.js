import React, { Fragment } from "react";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of a React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};
//essa função pré-gera todas as paginas durante o o PROCESSO DE BUILD.
//essa função é executada ANTES da execução dos componentes
//essa função é executada APENAS NO SERVIDOR, DURANTE O PROCESSO DE BUILD, NUNCA VAI PARA O CLIENTE
export async function getStaticProps() {
  // buscar dados de uma api ou conectar em um banco de dados

  const client = await MongoClient.connect(
    "mongodb+srv://root:rnP7qFHmLfGkeEBK@cluster0.5juoc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const dataBase = client.db();
  const meetupsCollection = dataBase.collection("meetup");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  // props será as props que serão recebidas como parametro por este componente
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    //revalidate vai fazer nextjs republicar o site a cada 10 segundos para exportar os dados para SEO
    revalidate: 10,
  };
}

//essa função é executada ANTES da execução dos componentes
//essa função é executada APENAS NO SERVIDOR, PARA CADA REQUISIÇÃO AO SERVIDOR, NUNCA VAI PARA O CLIENTE
//funciona como midlleware
//não é necessário para essa aplicaçãoç
//getStaticProps é mais indicado
/*export async function getServerProps(context) {
  // buscar dados de uma api ou conectar em um banco de dados

  const request = context.req;
  const response = context.res;

  // props será as props que serão recebidas como parametro por este componente
  return {
    props: DUMMY_MEETUPS,
  };
}*/

export default HomePage;
