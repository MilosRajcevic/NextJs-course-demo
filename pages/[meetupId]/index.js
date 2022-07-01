import Head from "next/head";

import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

// To understand it, let's again think about the fact that with getStaticProps
// a page is pre-generated during the build process. Now, what does this mean?
// This means that of course, NextJS needs to pre-generate all versions of this dynamic page in advance
// for all the supported IDs. Because since this is dynamic, NextJS needs to know
// for which ID values it should pre-generate the page.

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://milos:hIOfrW5dzgrnfy9R@cluster0.cwme6rx.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  // Great, but keep in mind that this is not pre-generated when a user visits this page with a specific value
  // in the URL, but during the build process. So here we need to pre-generated for all the URLs,
  // for all the meetup ID values users might be entering at runtime.

  return {
    // Falback property explanation
    // This key tells NextJS whether your paths array
    // contains all supported parameter values or just some of them.
    // If you set fall back to false, you say that your paths  contains all supported meetup ID values.
    // That means that if the user enters anything that's not supported here, for example, M3
    // he or she would see a 404 error.

    // When you set fallback to true or to blocking, you're telling NextJS that the list of paths
    // which you're specifying here, might not be exhaustive, there might be more valid pages.
    // And, therefore, when fallback is set to true or to blocking,
    // NextJS will not respond with a 404 page if it can't find the page immediately.
    // Instead with fallback set to true or blocking, it will then generate that page on demand,
    // and thereafter cache it, so it will pre-generate it when needed.

    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a signle meetup

  // So when we reach out to an API to fetch the data for a single meetup,
  // we need a way of identifying that meetup. We need its ID for example.
  // Now the ID thankfully is encoded into URL. And therefore, we did learn
  // that we can use stead use router hook to get access
  // to this router object and then use the query property there.
  // That's what we did earlier in this course.
  // But the problem with that is that the use router hook can only be used in the component function, not in geStaticProps.
  // That's not a function where you can use react hooks. So we can't get to the meetup ID
  // from the URL with help of use router in here. But we also don't need to.
  // Because you might remember this context parameter, which I mentioned.

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://milos:hIOfrW5dzgrnfy9R@cluster0.cwme6rx.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  return {
    props: {
      // meetupData: {
      //   image:
      //     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/West_side_of_Manhattan_from_Hudson_Commons_%2895103p%29.jpg/1024px-West_side_of_Manhattan_from_Hudson_Commons_%2895103p%29.jpg",
      //   id: meetupId,
      //   title: "A First Meetup",
      //   address: "Some Stret 5, City",
      //   description: "First Description",
      // },

      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}

export default MeetupDetails;
