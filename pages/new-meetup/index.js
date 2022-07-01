import Head from "next/head";

// our-domain.com/new-meetup
import { useRouter } from "next/router";
import { Fragment } from "react";

import NewMeetUpForm from "../../components/meetups/NewMeetupForm";

function NewMeetUpPage() {
  const router = useRouter();

  async function addMeetupHandler(enteredMeetupData) {
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Vracamo se na pocetnu stranu
    router.push("/");
  }

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta
          name="description"
          content="Add your own meetups and create amazing"
        />
      </Head>
      <NewMeetUpForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}

export default NewMeetUpPage;
