let searchName = null;
let btnSearch = null;
let allUsers = [];

let userList = null;
let summary = null;

let loader = null;

let numberFormat = null;

window.addEventListener('load', () => {
    searchName = document.querySelector('#searchName');
    btnSearch = document.querySelector('#btnSearch');

    userList = document.querySelector('.user-list');
    summary = document.querySelector('.summary');
    
    loader = document.querySelector('.loader');

    userList.innerHTML = '<h4>Nenhum usuário Filtrado</h4>'
    summary.innerHTML = '<h4>Nada a ser Exibido</h4>'

    numberFormat = Intl.NumberFormat('pt-BR');
    
    fetchUserList();
    
    searchName.addEventListener('keyup', verifySearchName);
    btnSearch.addEventListener('click', performSearch);
});

async function fetchUserList(){
    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();


    allUsers = json.results.map(user =>{
  
      const {name:{ first, last}, picture: {thumbnail}, dob:{age}, gender} = user;
      const composedName = first + ' ' + last; 
  
      return {
        name: composedName,
        lowerName: composedName.toLocaleLowerCase(),
        picture: thumbnail,
        age,
        gender
      };
    });

    allUsers.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    
    
    loader.remove();

    searchName.disabled = false;
    searchName.focus();
    
}

function verifySearchName(event){
    if (event.target.value !== ''){
        btnSearch.classList.remove('disabled');
        
        if(event.keyCode === 13){
            search(searchName.value);
        }
    }else{
        btnSearch.classList.add('disabled');
    }
}

function performSearch(){
    search(searchName.value);
}

function search(informedName){

    informedName = informedName.toLocaleLowerCase();

    let foundUsers = allUsers.filter(user => user.lowerName.includes(informedName))

    render(foundUsers);
}

function render(foundUsers){

    let foundNumer = foundUsers.length;

    if (foundNumer === 0){
        userList.innerHTML = '<h4>Nenhum usuário Filtrado</h4>'
        summary.innerHTML = '<h4>Nada a ser Exibido</h4>'

        return;
    }

    let male = 0;
    let female = 0;
    let sumAge = 0;
    

    let usersHTML = `
        <div>
            <div id="resume">
                <h4>
                    ${foundNumer} usuários(s)
                    <br/>
                    encontrado(s)
                </h4>
            </div>
    `;


    foundUsers.forEach(user => {

        const {gender, age, picture, name } = user;
        
        if(gender === 'male'){
            male ++;
        }else{
            female ++;
        }

        sumAge += age;

        let userHTML = `
            <div class="user">
                <img src=${picture} >
                ${name}, ${age} anos
            </div>
        `;

        usersHTML += userHTML;
    })

    usersHTML += '</div>';
    userList.innerHTML = usersHTML;

    const avrgAge = formatNumber(sumAge / foundNumer);

    sumAge = formatNumber(sumAge);

    const summaryHTML = `
        <div>
            <h4>
                Estatísticas
            </h4>
            <div class="detail">
                Sexo Masculino: <span> ${male} </span>
            </div>
            <div class="detail">
                Sexo Feminino: <span> ${female} </span>
            </div>
            <div class="detail">
                Soma das idades: <span> ${sumAge} </span>
            </div>
            <div class="detail">
                Média das idades: <span> ${avrgAge} </span>
            </div>
        </div>
    `;

    summary.innerHTML = summaryHTML;
}

function formatNumber(number){
    return numberFormat.format(number);
  }