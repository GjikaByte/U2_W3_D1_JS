/* ---------- Esercizio 1: lasciato com'è ---------- */
class User {
  constructor(firstName, lastName, age, location) {
    this.firstName = firstName; this.lastName = lastName;
    this.age = +age; this.location = location;
  }
  fullName(){ return `${this.firstName} ${this.lastName}`; }
  compareAge(o){
    if (this.age > o.age) return `${this.fullName()} è più vecchio di ${o.fullName()} (${this.age} vs ${o.age})`;
    if (this.age < o.age) return `${this.fullName()} è più giovane di ${o.fullName()} (${this.age} vs ${o.age})`;
    return `${this.fullName()} e ${o.fullName()} hanno la stessa età (${this.age})`;
  }
}

/* ---------- Esercizio 2: versione semplificata ---------- */
class Pet {
  static _id = 0;
  constructor(name, owner, species, breed){
    this.id = ++Pet._id;
    this.petName = name; this.ownerName = owner;
    this.species = species; this.breed = breed;
  }
  sameOwner(p){
    const n = s => s.trim().toLowerCase();
    return n(this.ownerName) === n(p.ownerName);
  }
}

const pets = [];
const f  = document.getElementById('petForm');
const ul = document.getElementById('petList');

f.addEventListener('submit', e=>{
  e.preventDefault();
  const {petName, ownerName, species, breed} = f.elements;
  pets.push(new Pet(petName.value, ownerName.value, species.value, breed.value));
  f.reset(); petName.focus(); render();
});

// Event delegation for delete buttons
ul.addEventListener('click', e=>{
  const id = e.target.dataset.del;
  if (!id) return;
  const i = pets.findIndex(p => p.id == id);
  if (i > -1){ pets.splice(i,1); render(); }
});

function render(){
  ul.innerHTML = pets.map(p=>{
    const same = pets.filter(q => q !== p && p.sameOwner(q))
                     .map(q => esc(q.petName)).join(', ');
    return `<li>
      <div>
        <div><strong>${esc(p.petName)}</strong>
          <span class="meta">(${esc(p.species)}, ${esc(p.breed)})</span>
        </div>
        <div class="meta">
          Padrone: <strong>${esc(p.ownerName)}</strong>
          ${same ? ` <span class="owner-match">— stesso padrone di ${same}</span>` : ''}
        </div>
      </div>
      <div class="actions"><button type="button" data-del="${p.id}">Elimina</button></div>
    </li>`;
  }).join('');
}

const esc = s => String(s).replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));

// first paint
render();
