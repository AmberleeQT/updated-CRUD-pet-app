/*
* Inputs
  <input type="text" name="pet-name" id="pet-name" required />
  <input type="number" name="age" id="age" />
  <input type="text" name="owner-name" id="owner-name" required />
  <input type="text" name="species" id="species" required /
  <input type="text" name="breed" id="breed" required />

*/

// ** Variables

let petName = document.getElementById('pet-name');
let petAge = document.getElementById('age');
let ownerName = document.getElementById('owner-name');
let petSpecies = document.getElementById('species');
let petBreed = document.getElementById('breed');

const main = document.querySelector('main');

const URL = 'https://crud-updated-pet-app-default-rtdb.firebaseio.com/pets';
const EXT = '.json';

// ** Functions
window.addEventListener('load', getPets());

/* pet {
	name
	age
	owner 
	species
	breed
}
*/

// ** CREATE
function handleFormSubmit() {
	const newPet = readFormData();
	const newUUID = generateUUID();
	postPet(newUUID, newPet);
	appendNewRecord(newUUID, newPet);
	resetForm();
}

function readFormData() {
	let newPetData = {
		name: petName.value.toUpperCase(),
		age: petAge.value,
		owner: ownerName.value.toUpperCase(),
		species: petSpecies.value.toUpperCase(),
		breed: petBreed.value.toUpperCase(),
	};

	console.log(newPetData);
	return newPetData;
}

function appendNewRecord(uuid, data) {
	const card = document.createElement('div');
	card.classList.add('pet-card');
	card.setAttribute('id', uuid);

	const cardContent = document.createElement('div');
	cardContent.classList.add('content');
	cardContent.innerHTML = `
    <label>Pet Name: 
    <input type="text" value="${data.name}" readonly />
		</label>

    <label>Age: 
    <input type="text" value="${data.age}" readonly />
		</label>
    <label>Owner: 
    <input type="text" value="${data.owner}" readonly />
		</label>
    <label>Species: 
    <input type="text" value="${data.species}" readonly />
		</label>
    <label>Breed:
    <input type="text" value="${data.breed}" readonly />
		</label>
  `;

	const cardBtns = document.createElement('div');
	cardBtns.classList.add('actionBtns');
	cardBtns.innerHTML = `
    <button onclick="deletePet(this)" class="deleteBtn" type="submit">Delete</button>
    <button onclick="editPet(this)" class="editBtn" type="button">Edit</button>
  `;

	card.appendChild(cardContent);
	card.appendChild(cardBtns);

	list.appendChild(card);
}

function resetForm() {
	petName.value = '';
	petAge.value = '';
	ownerName.value = '';
	petSpecies.value = '';
	petBreed.value = '';
}

// ** READ - GET
function getPets() {
	let petsObj;
	// fetch('/data.json')
	fetch(`${URL}${EXT}`)
		.then((resp) => resp.json())
		.then((data) => {
			petsObj = { ...data };

			createNewList();

			Object.keys(petsObj).forEach((pet) => {
				let petInfo = petsObj[pet];
				appendNewRecord(pet, petInfo);
			});
		});
}

function createNewList() {
	const oldList = document.querySelector('section');
	if (oldList) {
		oldList.remove();
	}

	const list = document.createElement('section');
	list.setAttribute('id', 'list');
	main.appendChild(list);
}

// ** Create - POST
async function postPet(uuid, pet) {
	// async function postPet(pet) {
	fetch(`${URL}/${uuid}${EXT}`, {
		// fetch(`${URL}${EXT}`, {
		method: 'PUT',
		// method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...pet }),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log('data', data);
		})
		.catch((err) => console.log('error: ', err));
}

// ** UPDATE/EDIT
function editPet(btn) {
	// 'this' -> btn clicked
	const currentPet = btn.parentElement.parentElement;
	const petInfo = currentPet.children[0];
	const petInputArr = petInfo.querySelectorAll('input');
	const currentUUID = currentPet.id;

	let updatedPet;

	if (btn.innerHTML.toUpperCase() === 'EDIT') {
		btn.innerHTML = 'Save';
		petInputArr.forEach((field) => field.removeAttribute('readonly'));
	} else {
		btn.innerHTML = 'Edit';
		petInputArr.forEach((field) => field.setAttribute('readonly', 'readonly'));
		updatedPet = {
			name: petInputArr[0].value.toUpperCase(),
			age: petInputArr[1].value,
			owner: petInputArr[2].value.toUpperCase(),
			species: petInputArr[3].value.toUpperCase(),
			breed: petInputArr[4].value.toUpperCase(),
		};

		// ** PUT
		fetch(`${URL}/${currentUUID}${EXT}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatedPet),
		})
			.then((resp) => resp.json())
			.then((data) => console.log(data));
	}
}

// ** DELETE -- DONE
function deletePet(btn) {
	const currentPet = btn.parentElement.parentElement;
	const currentUUID = currentPet.id;

	// ** Remove from DB with UUID
	fetch(`${URL}/${currentUUID}${EXT}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((resp) => resp.json())
		.then((data) => console.log(data));

	// ** Delete Element from DOM
	currentPet.remove();
}

// ** UUIG
function generateUUID() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}
