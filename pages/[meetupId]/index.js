import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        description={props.meetupData.description}
        address={props.meetupData.address}
      />
    </Fragment>
  );
};
//função usada quando fazemos uso da função getStatisProps
//precisamos dessa função para informar todos os Ids para pré-gerar todas as páginas
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://root:rnP7qFHmLfGkeEBK@cluster0.5juoc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const dataBase = client.db();
  const meetupsCollection = dataBase.collection("meetup");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    //Atributo fallback:
    //informa se vc mapeou todas as urls possiveis para esse component ou só alguns
    // caso false, vc informa que mapeou todos os ids das urls, então qualquer url não mapeada retornará 404

    // caso true, nextjs vai terntar gerar essa pagina dinamicamente pelo id para cada requisição que chegar no servidor, então é bom para mapear algumas paginas mais importantes e carregar mais rapido
    // caso true, vai retornar uma pagina vazia imediatamente para o usuario e depois retorna a pagina completa quando os dados estiverem prontos
    // caso true, enquanto os dados não estão prontos e a pagina em branco é mostrada, temos que tratar esses casos sem dados ainda, talvez com um component de loading

    //caso 'blocking' funciona igual true, com a diferença que nada é mostrado ao usuario enquanto os dados não estão prontos, então não precisamos tratar nda
    fallback: "blocking",
    //em produção, consultar os ids pela API
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}
//essa função pré-gera todas as paginas durante o PROCESSO DE BUILD.
//Para páginas dinamicas (como esta), nextjs pré-gera todas as páginas para cada Id
//por isso precisamos da função getStaticPaths() para informar todos os Ids para pré-gerar todas as páginas
export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://root:rnP7qFHmLfGkeEBK@cluster0.5juoc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const dataBase = client.db();
  const meetupsCollection = dataBase.collection("meetup");
  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
  return {
    props: {
      meetupData: {
        id: meetup._id.toString(),
        image: meetup.image,
        description: meetup.description,
        address: meetup.address,
        title: meetup.title,
      },
    },
  };
}
export default MeetupDetails;
