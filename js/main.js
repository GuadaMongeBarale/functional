const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

const attrsToString = (obj = {}) =>
  Object.keys(obj)
  .map((attr)=> `${attr}="${obj[attr]}"`)
  .join('')

const tagAttrs = obj => (content = '') => 
`<${obj.tag} ${obj.attrs ? '' : ''}${attrsToString(obj.attrs)}> ${content} </${obj.tag}>`


const tag = t => typeof t === 'string' ? tagAttrs({tag: t }) : tagAttrs(t)

const tableRowTag = tag('tr')

const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const editIcon = tag({tag: 'i', attrs: {class: 'fas fa-pencil-alt'}})('')

const trashIcon = tag({tag: 'i', attrs: {
  class:'fas fa-trash-alt'
}})('')


const description = document.getElementById('description')
const qty = document.getElementById('qty')
const calories = document.getElementById('calories')
const carbs = document.getElementById('carbs')
const protein = document.getElementById('protein')

const tQTY = document.querySelector('#tQTY')
const tCalories = document.querySelector('#tCalories')
const tCarbs = document.querySelector('#tCarbs')
const tProtein = document.querySelector('#tProtein')

const tbody = document.querySelector('tbody')

const footer = document.querySelector('.card-footer')
const btn = document.querySelector('#btn')
const icon = document.querySelector('#icon')

let list = []

description.addEventListener('keydown', () => description.classList.remove('is-invalid'))
calories.addEventListener('keydown', () => calories.classList.remove('is-invalid'))
carbs.addEventListener('keydown', () => carbs.classList.remove('is-invalid'))
protein.addEventListener('keydown', () => protein.classList.remove('is-invalid'))

//utils
function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

const cleanInputs = () => {
  description.value = ''
  qty.value = 1
  calories.value = 0
  carbs.value = 0
  protein.value = 0
}

const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0, qty = 0
  list.map(item => {
    qty += item.qty,
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  tQTY.textContent = qty
  tCalories.textContent = roundToTwo(calories)
  tCarbs.textContent = roundToTwo(carbs)
  tProtein.textContent = roundToTwo(protein)
}

const renderItems = ()=> {
  tbody.innerHTML = ''
  list.map((item, index) => {

    const editBtn = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-info',
        onclick: `editItem(${index})`,
        title: 'Edit'
      }
    })(editIcon)

    const removeBtn = tag({tag:'button', attrs:{
      class:'btn btn-outline-danger',
      onclick:`removeItem(${index})`
    }})(trashIcon)

    tbody.innerHTML +=tableRow([item.description, item.qty, item.calories, item.carbs, item.protein, editBtn, removeBtn])
  })

}


const add = () => {
  const q = parseFloat(qty.value)
  const newItem = {
    description: description.value,
    qty: q,
    calories: roundToTwo((calories.value) * q),
    carbs:roundToTwo((carbs.value) * q ),
    protein: roundToTwo((protein.value) * q)
  }

  list.push(newItem)
  cleanInputs()
  updateTotals()
  renderItems()
}

const validateInputs = () => {

  description.value ? '' : description.classList.add('is-invalid')
  qty.value > 0 ? '' : qty.value = 1
  calories.value > 0 ? '' : calories.classList.add('is-invalid')
  carbs.value > 0 ? '' : carbs.classList.add('is-invalid')
  protein.value > 0 ? '' : protein.classList.add('is-invalid')
  
  if (description.value  && calories.value > 0  && carbs.value > 0 && protein.value > 0) {
    add();
  }
  if (footer.className == 'card-footer edit') {
    footer.classList.remove('edit')
    btn.classList.remove('edit-btn')
    icon.classList.add('fa-plus')
    icon.classList.remove('fa-sync-alt')
  }
}

const removeItem = (index) => {
  list.splice(index, 1)
  updateTotals()
  renderItems()
}

const editItem = (index) => {

  const item = {...list[index]}

  removeItem(index)

  footer.classList.add('edit')
  btn.classList.add('edit-btn')
  icon.classList.remove('fa-plus')
  icon.classList.add('fa-sync-alt')

  description.value = item.description
  qty.value = item.qty
  calories.value = item.calories
  carbs.value = item.carbs
  protein.value = item.protein
}













