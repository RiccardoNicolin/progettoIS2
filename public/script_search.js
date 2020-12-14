function Logout(){
    localStorage.setItem("token", "000");
    document.getElementById("login").style.display = "block";
    document.getElementById("user").innerHTML = "";
    document.getElementById("logout").style.display = "none";
    document.getElementById("register").style.display = "block";
    window.open("./","_self");
}

function Login(){
    sessionStorage.setItem("old_url","../");
    window.open("./login.html","_self");
}

function Search(){
    const query = document.getElementById("search_bar").value;
    sessionStorage.setItem("query",query);
    let series = sessionStorage.getItem('all_serie');
    SetResult(JSON.parse(series));
}

function SetResult(res){
   
    const query = sessionStorage.getItem("query").toLowerCase();
     part = res.filter(element => element.name.toLowerCase().includes(query));
        if (part === undefined){
            document.getElementById("result").innerHTML="No series with this parameters"
        }else{
            document.getElementById("result").innerHTML="";
            part.map(x => {
                document.getElementById("result").innerHTML+='<div class="single"><a href="./serie.html?name='+x.name+'"><img src='+x.poster+'><br><span>'+x.name+'</span></a></div>';
            })
            
        }
    }

function FilterTag(tag){
    const query = sessionStorage.getItem("query");
    let series = sessionStorage.getItem('all_serie');
    let res = JSON.parse(series);
    let part = res.filter(element => element.name.includes(query));
    let filtered = part.filter(element => element.tag.includes(tag));
    SetResult(filtered); 
}

function Filter(genre){
    const query = sessionStorage.getItem("query");
    let series = sessionStorage.getItem('all_serie');
    let res = JSON.parse(series);
    let part = res.filter(element => element.name.includes(query));
    let filtered = part.filter(element => element.genre.includes(genre));
    SetResult(filtered); 
}

function SetPage(){
    fetch('./series/',{
        method:'GET',
        headers: {
            Authorization: 'Bearer '+localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(json => {
        sessionStorage.setItem("all_serie",JSON.stringify(json.allseries));
        SetResult(json.allseries);
    })
}
SetPage();

