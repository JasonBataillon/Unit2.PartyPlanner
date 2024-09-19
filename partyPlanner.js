const COHORT = '2408-Jason';
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

// === State ===
let events = [];

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const responseObj = await response.json();
    events = responseObj.data;
  } catch (error) {
    console.error(error);
  }
}

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

function renderEvents() {
  const ul = document.querySelector('ul.events');

  if (!events.length) {
    ul.innerHTML = `
    <li>Looks like you just aren't popular enough to party with.</li>`;
    return;
  }

  const eventz = events.map((event) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <h2>${event.name}</h2>
        <time datetime = "${event.date}">${event.date.slice(0, 10)}</time>
        <p>${event.description}</p>
        <address>${event.location}</address>
        <button>Delete</button>`;

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

const form = document.querySelector('form');
form.addEventListener('submit', async (event1) => {
  event1.preventDefault();

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
