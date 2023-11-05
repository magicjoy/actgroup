// const marks = ['h','c','s','d'];
// const numbers = ["A",1,2,3,4,5,6,7,8,9,10,"J","K","Q"];//A는 1 또는 11로 J K Q 은 모두 10으로 취급한다.;
// let deck = [];
// winning_count = 0;
// function card_selection(pdeck) {
//     var mark = marks[parseInt(Math.random()*3)];
//     var number = numbers[parseInt(Math.random()*12)]
//     pdeck.push([mark,number])
//     console.log(pdeck)
// }
// card_selection(deck)


// 카드 문양별 A, 2~10, J, K, Q 카드 생성(총 52개) - deck
numbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "K", "Q"];
deck = [];
d_deck = [];
p_deck = [];
total = [0,0,0,0] //플레이어 토탈, 딜러 토탈, 플레이어 A 수, 딜러 A 수
A_case = {1:[1,10],2:[2,11,20],3:[3,12,21],4:[4,13]}
for (i = 0; i < 13; i++) {
    deck.push("h" + numbers[i]);
    deck.push("c" + numbers[i]);
    deck.push("s" + numbers[i]);
    deck.push("d" + numbers[i]);
}

shuffle(deck)
console.log(deck)
// array 내 함수 무작위로 섞는 함수 - function shuffle()
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}


// 베팅 금액 초기값을 1,000원으로 지정 - inputValue
window.onload = function() {
    inputValue = 1000;
    $("#input").text(inputValue);
}

// up 버튼 누르면 베팅 금액 1,000원씩 올리고 inputValue에 그 값 저장하기
function up() {
    inputValue += 1000;
    $("#input").text(inputValue);

    // 베팅 금액이 1,000원보다 클 때 down 버튼 활성화(css에서 기본적으로 클릭하지 못하도록 설정해 둠)
    if (inputValue > 1000) {
        $("#down").css("pointer-events", "all")
    }
}

// down 버튼 누르면 베팅 금액 1,000원씩 내리고 inputValue에 그 값 저장하기
function down() {
    inputValue -= 1000;
    $("#input").text(inputValue);
    
    // 베팅 금액이 1,000원일 때 down 버튼 비활성화
    if (inputValue == 1000) {
        $("#down").css("pointer-events", "none")
    }
}
function sum_total(a,types) {
    total[types] = 0
    tem = ''
    for(i=0;i<a.length;i++) {
        tem = a[i].substring(1)
        if(Number.isInteger(parseInt(tem))){
            total[types] += parseInt(tem)
        } else if(tem != "A") {
            total[types] += 10
        } else {
            continue;
        }
    }
    if (types == 1 && total[3] != 0) {
        let temp = [];
        for(i = 0;i<A_case[total[3]].length;i++) {
            temp.push(total[1] + A_case[total[3]][i] <= 21? (total[1] + A_case[total[3]][i]) : 0)
        }
        total[1] = Math.max(temp)
    }
}
// 시작 버튼 누를 시
function start() {

    // 화면 좌측 상단에 베팅 금액 띄우기
    $("#betPrice").text(inputValue + "원");
    $("#bet").css("display", "none");
    $("#betPrice").css("display", "block");
    $("#currentPoint").css("display", "block");
    $("#hit").css("display", "block");
    $("#stand").css("display", "block");

    // 플레이어에게 deck의 카드 지급(iArray[0]~iArray[25]: 플레이어 카드)
    for (x = 0; x < 2; x++) {
        $("#player").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>");
        p_deck.push(deck[0]);
        if (deck[0].endsWith('A')) {
            total[2] += 1
        }
        deck.shift();
    }
    sum_total(p_deck,0)
    $("#currentPoint > p:nth-of-type(1)").empty()
    $("#currentPoint > p:nth-of-type(1)").append(total[0])
    $("#currentPoint > p:nth-of-type(2)").empty()
    $("#currentPoint > p:nth-of-type(2)").append("A " + total[2] + "개")
    // 딜러에게 deck의 카드 지급
    for (y = 0; y < 2; y++) {
        $("#bet").css("display", "none");
        $("#dealer").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>");
        d_deck.push(deck[0]);
        if (deck[0].endsWith('A')) {
            total[3] += 1
        }
        deck.shift();
    }
}

// hit 버튼 누를 시
function hit() {

    // 플레이어에게 deck의 카드 지급
    $("#player").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>");
    p_deck.push(deck[0])
    if (deck[0].endsWith('A')) {
        total[2] += 1
    }
    deck.shift();
    sum_total(p_deck,0)
    $("#currentPoint > p:nth-of-type(1)").empty()
    $("#currentPoint > p:nth-of-type(1)").append(total[0])
    $("#currentPoint > p:nth-of-type(2)").empty()
    $("#currentPoint > p:nth-of-type(2)").append("A " + total[2] + "개")
    //21 넘을 시 게임 종료
    if (total[0] > 21) {
        game_result(0)
    }
}

function stand() {
    if (total[2]!=0) {
        $("#selectPoint").css("display", "flex");
        for(i=0;i<A_case[total[2]].length;i++){
            $("#selectPoint").append("<button id='"+ i + "' onclick='selectPoint(this.id)'>" + A_case[total[2]][i] + "점</button>");
        }
    } else {
        setTimeout(function(){dealer_action()},1500)
    }
}

function selectPoint(value){
    $("#selectPoint").css("display", "none")
    p_deck.push('h'+A_case[total[2]][value]);
    p_deck = p_deck.filter((element) => element != 'hA'&&element != 'sA'&&element != 'dA' && element != 'cA');
    sum_total(p_deck,0);
    $("#currentPoint > p:nth-of-type(1)").empty()
    $("#currentPoint > p:nth-of-type(1)").append(total[0])
    setTimeout(function(){dealer_action()},1500)
}

function dealer_action() {
    sum_total(d_deck,1)
    if (total[1]<16) {
        d_deck.push(deck[0]);
        $("#dealer").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>");
        if (deck[0].endsWith('A')) {
            total[3] += 1
        }
        deck.shift()
        var timer = setTimeout(function(){dealer_action()},1500)
    }
    console.log(total)
    if (total[1]>21) {
        clearTimeout(timer)
        setTimeout(function(){game_result(1)},1500)
        game_result(1)
    } else if (total[0] <= total[0]) {
        clearTimeout(timer)
        setTimeout(function(){game_result(0)},1500)
    } else {
        clearTimeout(timer)
        setTimeout(function(){game_result(1)},1500)
    }
}

function reset() {
    deck = [];
    d_deck = [];
    p_deck = [];
    total = [0,0,0,0];
    for (i = 0; i < 13; i++) {
        deck.push("h" + numbers[i]);
        deck.push("c" + numbers[i]);
        deck.push("s" + numbers[i]);
        deck.push("d" + numbers[i]);
    }
    
    shuffle(deck)

    $('#dealer').empty()
    $('#player').empty()
}

function game_result(status) {
    reset()
    if (status == 0) {
        // 플레이어 패배
        $("#result").text('딜러 승리');
        console.log('딜러 승리')
    } else if (status == 1) {
        $("#result").text('플레이어 승리');
        console.log('플레이어 승리')
    }
    $("#over_page").css("display", "block");
    $("#result").css("display", "block");

    $("#betPrice").css("display", "none");
    $("#currentPoint").css("display", "none");
    $("#hit").css("display", "none");
    $("#stand").css("display", "none");
}