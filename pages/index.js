import Head from "next/head";

import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

////// SAV OVAJ TEXT JE KAKO DA SKLONIMO FETCHING SA CLIENT RACUNARA NA SERVER-SIDE /////////////////////

// Moramo da prosledimo props, ali props iz getStatisProps f-je
function HomePage(props) {
  // Ne moramo vise da menagujemo state niti da koristimo useEffect, zato
  // sto smo to odradili sa getStatisProps() f-jom

  // const [loadedMeetups, setLoadedMeetups] = useState();
  // useEffect(() => {
  //   // send a http request and fetch data
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// // This function will now not run
// // during the build process,
// // but instead always on the server after deployment.

// export async function getServerSideProps(context) {
//   // There, you also get request and response objects
//   // in your middleware to then work with those.
//   // And especially having access
//   // to the concrete request object can be helpful.
//   // For example, when you're working with authentication,
//   // and you need to check some session cookie
//   // or anything like this.

//   const request = context.req;
//   const response = context.res;

//   // Fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// This code is executed during the build process,
// not on the server and especially not on the clients
// of your visitors.

export async function getStaticProps() {
  // Fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://milos:hIOfrW5dzgrnfy9R@cluster0.cwme6rx.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  // Ova f-ja uvek mora da vrati objekat
  return {
    // Moramo imati props property !!!
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    // Ovo je properti koji definise vreme posle kog ce se stranica regenerisati posle zadatog broja sec
    revalidate: 10,
  };
}

export default HomePage;
