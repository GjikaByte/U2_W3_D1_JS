// -------------------- Esercizio 1  --------------------
class User {
  constructor(firstName, lastName, age, location) {
    this.firstName = firstName;
    this.lastName  = lastName;
    this.age       = Number(age);
    this.location  = location;
  }
  fullName() { return `${this.firstName} ${this.lastName}`; }
  compareAge(other) {
    if (this.age > other.age) return `${this.fullName()} è più vecchio di ${other.fullName()} (${this.age} vs ${other.age})`;
    if (this.age < other.age) return `${this.fullName()} è più giovane di ${other.fullName()} (${this.age} vs ${other.age})`;
    return `${this.fullName()} e ${other.fullName()} hanno la stessa età (${this.age})`;
  }
}

// Example:
const x = new User("Mario","Rossi",34,"Roma");
const y = new User("Giulia","Bianchi",28,"Milano");
const z = new User("Luca","Verdi",34,"Torino");
console.log(x.compareAge(y));
console.log(y.compareAge(x));
console.log(x.compareAge(z));


// -------------------- Esercizio 2  --------------------
class Pet {
  constructor(petName, ownerName, species, breed) {
    this.petName   = petName;
    this.ownerName = ownerName;
    this.species   = species;
    this.breed     = breed;
    // stable id for delete
    this.id = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : "p_" + Math.random().toString(36).slice(2);
  }
  // true if two pets share the same owner (case/space-insensitive)
  hasSameOwner(other) {
    const norm = s => s.trim().toLowerCase();
    return norm(this.ownerName) === norm(other.ownerName);
  }
}

// State
const pets = [];

// Safe helper (single definition)
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

// DOM + handlers
document.addEventListener("DOMContentLoaded", () => {
  const form     = document.getElementById("petForm");
  const list     = document.getElementById("petList");
  const clearBtn = document.getElementById("clearAll"); // may not exist in your HTML

  if (!form || !list) return; // page doesn't contain the pet UI

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const pet = new Pet(
      fd.get("petName"),
      fd.get("ownerName"),
      fd.get("species"),
      fd.get("breed")
    );
    pets.push(pet);
    render();
    form.reset();
    form.elements.namedItem("petName")?.focus();
  });

  clearBtn?.addEventListener("click", () => {
    if (!pets.length) return;
    if (confirm("Svuotare la lista dei pet?")) {
      pets.splice(0, pets.length);
      render();
    }
  });

  function render() {
    list.innerHTML = "";

    pets.forEach((p) => {
      // find other pets sharing same owner
      const sameOwnerNames = pets
        .filter(q => q !== p && p.hasSameOwner(q))
        .map(q => q.petName);

      const li = document.createElement("li");
      li.innerHTML = `
        <div class="grow">
          <div class="pet-head">
            ${escapeHtml(p.petName)}
            <span class="meta">(${escapeHtml(p.species)}, ${escapeHtml(p.breed)})</span>
          </div>
          <div class="meta">
            Padrone: <strong>${escapeHtml(p.ownerName)}</strong>
            ${sameOwnerNames.length
              ? `<span class="owner-match">— stesso padrone di ${escapeHtml(sameOwnerNames.join(", "))}</span>`
              : ""}
          </div>
        </div>
        <div class="actions">
          <button type="button" class="secondary" data-del="${p.id}">Elimina</button>
        </div>
      `;
      list.appendChild(li);
    });


  }

  // initial render
  render();
});
