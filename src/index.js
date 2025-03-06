import './styles/main.scss'
import IMask from 'imask'

const modalElement = document.querySelector('.modal-overlay')
const modalEdit = document.querySelector('.modal-overlay2')
const openBtn = document.querySelector('.buttons__search-button')
let edit_id = null
var phoneInput = document.getElementById('phone-number')
var phoneInputEdit = document.getElementById('phone-number-edit')

var phoneMask = IMask(phoneInput, {
    mask: '+{7} (000) 000-00-00'
});
var phoneMaskEdit = IMask(phoneInputEdit, {
    mask: '+{7} (000) 000-00-00'
});
phoneMask.updateControl()

const latin_letters = 
[
'a','b','c','d','e',
'f','g','h','i','j',
'k','l','m','n','o',
'p','q','r','s','t',
'u','v','w','x','y',
'z'
]

const contacts = []

const handler = {
    set: function(target, prop, value) {
        if(prop !== 'length')addContact(prop, value);
        target[prop] = value;
        if(target.length === 0)clearContacts()
        return true
    },
    deleteProperty: function(target, prop) {
        delete target[prop]
        return true
    }
};

const proxyContacts = new Proxy(contacts, handler);

initTable(latin_letters)

function initTable(letters){
    const left_column = document.querySelector('.table-contact .left')
    const right_column = document.querySelector('.table-contact .right')

    for(let i = 0; i < letters.length; i++){
        const column_element = document.createElement('div')
        const span = document.createElement('span')
        const count_element = document.createElement('div')

        span.addEventListener('click',(e)=>{
            const infoBlocks = e.target.parentElement.querySelectorAll('.info-block')
            for(let i = 0; i < infoBlocks.length; i++){
                if(window.getComputedStyle(infoBlocks[i]).display === 'none'){
                    infoBlocks[i].style.display = 'flex'
                }else{
                    infoBlocks[i].style.display = 'none'
                }
            }
        })

        count_element.setAttribute('id',`count-${letters[i]}`)
        count_element.classList.add('count')
        column_element.classList.add('column__element')
        
        span.appendChild(count_element)
        span.innerHTML += letters[i]
        span.setAttribute('data-letter',letters[i])
        column_element.appendChild(span)

        if(i > 12){
            right_column.appendChild(column_element)
        }else{
            left_column.appendChild(column_element)
        }
    }
    
}
function addContact(id,contact){
    const countElement = document.querySelector(`[data-letter="${contact?.letter?.toLowerCase()}"] .count`)
    const columnElement =  document.querySelector(`[data-letter="${contact?.letter?.toLowerCase()}"]`)?.parentElement;
    const infoBlock = document.createElement('div');
    const infoContent = document.createElement('div');
    const nameBlock = document.createElement('div');
    const vacancyBlock = document.createElement('div');

    document.querySelectorAll('.info-block').forEach((el)=>{
        el.style.display = 'none'
    })

    infoBlock.classList.add('info-block');
    infoBlock.setAttribute('id',`${id}`)
    nameBlock.classList.add('info-block__name');

    nameBlock.innerHTML = `Name: <p>${contact.name}</p>`;
    let count = Number(countElement.textContent)
    count += 1
    countElement.textContent = count
    
    vacancyBlock.classList.add('info-block__vacancy');
    vacancyBlock.innerHTML = `Vacancy: <p>${contact.vacancy}</p>`;

    const numberBlock = document.createElement('div');

    numberBlock.classList.add('info-block__number');
    numberBlock.innerHTML = `Phone: <p>${contact.phone_num}</p>`;

    infoContent.appendChild(nameBlock);
    infoContent.appendChild(vacancyBlock);
    infoContent.appendChild(numberBlock);
    infoBlock.appendChild(infoContent);

    const deleteButton = document.createElement('i');
    deleteButton.classList.add('delete');

    deleteButton.addEventListener('click',(e)=>{deleteContact(e.target.parentElement.getAttribute('id'))})

    infoBlock.appendChild(deleteButton);

    columnElement.appendChild(infoBlock);
}
function validationInputs(name,vacancy,phone){
    const inputs = {
        name:false,
        vacancy:false,
        phone:false
    }

    const regex = /^[a-zA-Z]+$/

    if(regex.test(name)){
        inputs.name = true
    }
    if(regex.test(vacancy)){
        inputs.vacancy = true
    }
    if(phone.masked.isComplete){
        inputs.phone = true
    }

    if(inputs.name && inputs.vacancy && inputs.phone)return true

    return false
}
function clearContacts(){
    const infoBlocksHtml = document.querySelectorAll('.info-block')
    const countsHtml = document.querySelectorAll('.count')

    for(let i = 0; i < infoBlocksHtml.length || i < countsHtml.length; i++){
        if(infoBlocksHtml[i])infoBlocksHtml[i].remove()
        if(countsHtml[i])countsHtml[i].textContent = ''
    }
}
function deleteContact(id){
    const countElement = document.querySelector(`[data-letter="${proxyContacts[id].letter}"] .count`)
    const usersSearchBlock = document.querySelector('.users')
    const columnElement = document.querySelector(`[data-letter="${proxyContacts[id].letter}"]`).parentElement
    let count = Number(countElement.textContent)
    count -= 1
    count === 0 || count < 0?countElement.textContent = '':countElement.textContent = count

    delete proxyContacts[id]
    if(columnElement.querySelector(`[id="${id}"]`))columnElement.querySelector(`[id="${id}"]`).remove()
    if(usersSearchBlock.querySelector(`[id="${id}"]`))usersSearchBlock.querySelector(`[id="${id}"]`).remove()
}

document.querySelector('.buttons__add-button').addEventListener('click',(e)=>{
    const name = document.getElementById('name').value.trim()
    const vacancy = document.getElementById('vacancy').value.trim()

    if(validationInputs(name,vacancy,phoneMask)){
        const contact = {   
            letter:name[0].toLowerCase(),
            name:name,
            vacancy:vacancy,
            phone_num:phoneInput.value
        }
        proxyContacts.push(contact)
    }else{
        const popUpElement = document.getElementById("pop-up-error");
        popUpElement.show()
        setTimeout(()=>popUpElement.close(),2500)
    }
})

document.querySelector('.buttons__clear-button').addEventListener('click',()=>{
   proxyContacts.length = 0
})

openBtn.addEventListener('click',()=>{
    document.body.style.overflowY = 'hidden'
    modalElement.style.display = 'flex'
})

document.addEventListener('click',(e)=>{
    if(e.target === modalElement){
        document.body.style.overflowY = 'auto'
        modalElement.style.display = 'none'
    }
});

document.addEventListener('click',(e)=>{
    if(e.target === modalEdit)modalEdit.style.display = 'none'
});

document.querySelector('.modal-content-edit__edit').addEventListener('click',(e)=>{
    console.log(e.target)
    const name = document.getElementById('name-edit').value.trim()
    const vacancy = document.getElementById('vacancy-edit').value.trim()

    if(validationInputs(name,vacancy,phoneMaskEdit)){
        const contact = {   
            letter:name[0].toLowerCase(),
            name:name,
            vacancy:vacancy,
            phone_num:phoneInputEdit.value
        }
        deleteContact(edit_id)
        proxyContacts.push(contact)
        modalEdit.style.display = 'none'
    }else{
        alert('Error')
    }
})

document.querySelector('.modal-content-edit__close').addEventListener('click',(e)=>{
    modalEdit.style.display = 'none'
})

document.querySelector('.modal-search__close').addEventListener('click',()=>{
    document.body.style.overflowY = 'auto'
    modalElement.style.display = 'none'
})

document.getElementById('search').addEventListener('input',(e)=>{
    const value = e.target.value.toLowerCase()
    const usersBlocksHtml = document.querySelectorAll('.users .info-block')

    for(let i = 0; i < usersBlocksHtml.length; i++){
        usersBlocksHtml[i].remove()
    }

    if(value === '')return

    const findContacts = proxyContacts
                .map((contact,index)=>({ contact,index}))
                .filter(({contact})=>contact.name.toLowerCase().startsWith(value))
                .map(({contact,index})=>({ contact,index}));
    
    if(findContacts.length > 0){
        for(let i = 0; i < findContacts.length; i++){
            const infoBlock = document.createElement('div');
            const numberBlock = document.createElement('div');
            const infoContent = document.createElement('div');
            const nameBlock = document.createElement('div');
            const vacancyBlock = document.createElement('div');
            const editElment = document.createElement('span')
            infoBlock.classList.add('info-block');
            nameBlock.classList.add('info-block__name');
            nameBlock.innerHTML = `Name: <p>${findContacts[i].contact.name}</p>`;
            vacancyBlock.classList.add('info-block__vacancy');
            vacancyBlock.innerHTML = `Vacancy: <p>${findContacts[i].contact.vacancy}</p>`;
            numberBlock.classList.add('info-block__number');
            numberBlock.innerHTML = `Phone: <p>${findContacts[i].contact.phone_num}</p>`;
            infoBlock.setAttribute('id',findContacts[i].index)
            editElment.textContent = 'Edit'
            editElment.classList.add('edit')
            editElment.setAttribute('id',findContacts[i].index)

            infoContent.appendChild(nameBlock);
            infoContent.appendChild(vacancyBlock);
            infoContent.appendChild(numberBlock);
            infoBlock.appendChild(infoContent);

            const deleteButton = document.createElement('i');
            deleteButton.classList.add('delete');
            editElment.addEventListener('click',(e)=>{
                edit_id = e.target.id
                modalEdit.style.display = 'flex'
            })

            deleteButton.addEventListener('click',(e)=>{deleteContact(e.target.parentElement.getAttribute('id'))})

            infoBlock.appendChild(deleteButton);
            infoBlock.appendChild(editElment)

            document.querySelector('.users').appendChild(infoBlock); 
        }
    }
})