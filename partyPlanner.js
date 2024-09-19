const COHORT = '2408-Jason';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

// === State ===
let events = [];

// Updates the state section with events from the API
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const responseObj = await response.json();
    events = responseObj.data;
  } catch (error) {
    console.error(error);
  }
}

// Adds new events to the API
async function addEvent(event) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// Deletes events from the API
async function deleteEvent(id) {
  try {
    const response = await fetch(API_URL + id, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const responseObj = await response.json();
      throw new Error(responseObj.error.message);
    }
  } catch (error) {
    console.error(error);
  }
}

// === Render ===

//Renders the events on the webpage
function renderEvents() {
  const ul = document.querySelector('ul.events');

  //Prints this message if no events are rendered.
  if (!events.length) {
    ul.innerHTML = `
    <li>Looks like you just aren't popular enough to party with.</li>`;
    return;
  }
  // Puts the events in the ul section of the html as lists and creates a deleted button for each.
  const eventz = events.map((event) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <h2>${event.name}</h2>
        <time datetime = "${event.date}">${event.date.slice(0, 10)}</time>
        <p>${event.description}</p>
        <address>${event.location}</address>
        <button>Delete</button>`;

    // Gives the delete button its functionality to delete the selected event from the API
    const button = li.querySelector('button');
    button.addEventListener('click', async () => {
      await deleteEvent(event.id);
      await getEvents();
      renderEvents();
    });
    return li;
  });

  ul.replaceChildren(...eventz);
}

// === Script ===
async function initiate() {
  await getEvents();
  renderEvents();
}
initiate();

//Creates functionality for the form, allowing it to be submitted
const form = document.querySelector('form');
form.addEventListener('submit', async (event1) => {
  //Prevents the page from reloading after the form has been submitted
  event1.preventDefault();

  // Creates a new event using the used input when the from is submitted
  const date = new Date(form.date.value).toISOString();
  const event = {
    name: form.name.value,
    description: form.description.value,
    date,
    location: form.location.value,
  };
  await addEvent(event);
  await getEvents();
  renderEvents();
});
