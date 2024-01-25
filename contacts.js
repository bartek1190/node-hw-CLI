import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.join(process.cwd(), "./db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);
    return console.table(contactsParsed);
  } catch (error) {
    return console.log(error.message);
  }
}
async function getContactById(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);

    let getContact = `The contact with ID "${contactId}" does not exist.`;

    contactsParsed.map((contact) => {
      if (contactId === contact.id) {
        getContact =
          ` Below are the contact details for id: "${contactId}"\n` +
          `${contact.name}\n${contact.email}\n${contact.phone}`;
      }
    });

    return console.table(getContact);
  } catch (error) {
    return console.log(error.message);
  }
}
async function removeContact(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);
    const index = contactsParsed.findIndex(
      (contact) => contact.id === contactId
    );

    if (index >= 0) {
      const removedContact = contactsParsed.splice(index, 1)[0];

      const updatedContacts = JSON.stringify(contactsParsed, null, 2);
      console.log(`Contact "${removedContact.name}" successfully removed`);
      return fs.writeFile(contactsPath, updatedContacts);
    } else {
      console.log(
        `The contact with ID "${contactId}" does not exist in your contacts.`
      );
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
}
async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: nanoid(21),
      name,
      email,
      phone,
    };

    const contacts = await fs.readFile(contactsPath);
    const contactsParsed = JSON.parse(contacts);

    if (
      contactsParsed.find(
        (contact) =>
          contact.name?.toLowerCase() === newContact.name?.toLowerCase()
      )
    ) {
      console.log(`Contact ${name} already exist on list`);
      return;
    } else {
      contactsParsed.push(newContact);
    }

    const updatedContacts = JSON.stringify(contactsParsed, null, 2);
    await fs.writeFile(contactsPath, updatedContacts);
    return console.log(`Contact ${name} added successfully`);
  } catch (error) {
    return console.log(error.message);
  }
}
export { listContacts, getContactById, removeContact, addContact };
