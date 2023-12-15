// 카드 문양별 A, 2~10, J, K, Q 카드 생성(총 52개) - deck
numbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "K", "Q"]
deck = []
d_deck = []
p_deck = []
total = [0,0,0,0] //플레이어 토탈, 딜러 토탈, 플레이어 A 수, 딜러 A 수
A_case = {1:[1,11],2:[2,12],3:[3,13],4:[4,14]}
blackjack = [0,0]
for (i = 0; i < 13; i++) {
    deck.push("h" + numbers[i])
    deck.push("c" + numbers[i])
    deck.push("s" + numbers[i])
    deck.push("d" + numbers[i])
}

shuffle(deck)
// array 내 함수 무작위로 섞는 함수 - function shuffle()
function shuffle(array) {
    array.sort(() => Math.random() - 0.5)
}

// 베팅 금액 초기값을 100원으로 지정 - inputValue
window.onload = function() {
    inputValue = 100
    $("#input").text(inputValue + "원")
    $("#down").css("opacity", ".8")
}

// up 버튼 누르면 베팅 금액 100원씩 올리고 inputValue에 그 값 저장하기
function up() {
    inputValue += 100
    $("#input").text(inputValue + "원")

    // 베팅 금액이 100원보다 클 때 down 버튼 활성화(css에서 기본적으로 클릭하지 못하도록 설정해 둠)
    if (inputValue > 100) {
        $("#down").css({"pointer-events": "all", "opacity": "1"})
    }

    // 베팅 금액이 1000원일 때 up 버튼 비활성화
    if (inputValue >= 1000) {
        $("#up").css({"pointer-events": "none", "opacity": ".8"})
    }
}

// down 버튼 누르면 베팅 금액 100원씩 내리고 inputValue에 그 값 저장하기
function down() {
    inputValue -= 100
    $("#input").text(inputValue + "원")
    
    // 베팅 금액이 100원일 때 down 버튼 비활성화
    if (inputValue == 100) {
        $("#down").css({"pointer-events": "none", "opacity": ".8"})
    }

    // 베팅 금액이 1000원보다 작을 때 up 버튼 활성화
    if (inputValue < 1000) {
        $("#up").css({"pointer-events": "all", "opacity": "1"})
    }
}

softhit = false
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
            continue
        }
    }
    if (total[types+2]==1 && total[types] ==10 && a.length==2){
        blackjack[types] = 1
        if(types == 0) {
            $("#playerPoint > p").empty()
            $("#playerPoint > p").append("blackjack")
            $("#hit").css({"pointer-events": "none", "opacity": ".8"})
            $("#stand").css({"pointer-events": "none", "opacity": ".8"})
            setTimeout(function(){dealer_action()},1500)
            return
        }
    }
    if (types == 1) {
        if (total[3] == 1 && total[1]==6 && a.length==2) {
            softhit = true
        } else {
            softhit = false
        }    
        if (total[3] != 0) {
            let temp = []
            for(i = 0;i<A_case[total[3]].length;i++) {
                temp.push(total[1] + A_case[total[3]][i] <= 21? (total[1] + A_case[total[3]][i]) : 0)
            }
            total[1] = Math.max.apply(null, temp) == 0? total[1]+total[3] : Math.max.apply(null, temp) //total[1] == 0이면 딜러 패배 처리 필요
        }
    }
}
// 시작 버튼 누를 시
function start() {

    // 화면 좌측 상단에 베팅 금액 띄우기
    $("#betPrice").text("베팅 금액: " + inputValue + "원")
    $("#bet").css("display", "none")
    $("#betPrice").css("display", "block")
    $("#playerPoint").css("display", "block")
    $("#hit").css("display", "block")
    $("#stand").css("display", "block")
    $("#buttons").css("display", "block")

    // 플레이어에게 deck의 카드 지급
    for (x = 0; x < 2; x++) {
        $("#player").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>")
        p_deck.push(deck[0])
        if (deck[0].endsWith("A")) {
            total[2] += 1
        }
        deck.shift()
    }
    sum_total(p_deck,0)

    // 딜러에게 deck의 카드 지급
    for (y = 0; y < 2; y++) {
        $("#bet").css("display", "none")
        $("#dealer").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>")
        d_deck.push(deck[0])
        if (deck[0].endsWith('A')) {
            total[3] += 1
        }
        deck.shift()
    }
    sum_total(d_deck,1)

    $("#dealer > div:nth-of-type(2)").append("<img src='./files/back.svg'>")

    $("#playerPoint > p").empty()
    $("#playerPoint > p").append(total[0] + "점 + A " + total[2] + "개")

}

// hit 버튼 누를 시
function hit() {

    // 플레이어에게 deck의 카드 지급
    $("#player").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>")
    p_deck.push(deck[0])
    if (deck[0].endsWith('A')) {
        total[2] += 1
    }
    deck.shift()
    sum_total(p_deck,0)
    $("#playerPoint > p").empty()
    $("#playerPoint > p").append(total[0] + "점 + A " + total[2] + "개")
    //21 넘을 시 게임 종료
    if (total[0]+total[2] > 21) {
        game_result(0)
        return//warn
    }
}

function stand() {
    $("#dealerPoint").css("display", "block")
    $("#hit").css({"pointer-events": "none", "opacity": ".8"})
    $("#stand").css({"pointer-events": "none", "opacity": ".8"})
    if (total[0]+total[2] > 21) {
        game_result(0)
        return//warn
    }
    if (total[2]!=0) {
        $("#selectPoint").css("display", "flex")
        for(i=0;i<A_case[total[2]].length;i++){
            if(total[0]+A_case[total[2]][i]>21) {
                continue//warn
            }
            $("#selectPoint > div").append("<button id='"+ i + "' onclick='selectPoint(this.id)'>" + A_case[total[2]][i] + "점</button>")
        }
    } else {
        setTimeout(function(){dealer_action()},1500)
    }
}

function selectPoint(value){
    $("#selectPoint").css("display", "none")
    p_deck.push('h'+A_case[total[2]][value])
    p_deck = p_deck.filter((element) => element != 'hA'&&element != 'sA'&&element != 'dA' && element != 'cA')
    sum_total(p_deck,0)
    $("#playerPoint > p:nth-of-type(1)").empty()
    $("#playerPoint > p:nth-of-type(1)").append(total[0])
    sum_total(d_deck, 1)
    setTimeout(function(){dealer_action()},1500)
}

function dealer_action() {
    $("#dealer > div:nth-of-type(2) > img:nth-of-type(2)").animate({opacity: 0}, 300, function() {
        if ((total[1]<17||softhit) && total[1]!=0) {
            d_deck.push(deck[0]);
            $("#dealer").append("<div><p>" + deck[0] + "</p><img src='./files/" + deck[0] + ".svg'></div>")
            if (deck[0].endsWith('A')) {
                total[3] += 1
            }
            deck.shift()
            sum_total(d_deck,1)
            $("#dealerPoint > p:nth-of-type(1)").empty()
            $("#dealerPoint > p:nth-of-type(1)").append(total[1])
            var timer = setTimeout(function(){dealer_action()},1400)
        }
        if (total[1]>=17 && !softhit) {
            console.log(blackjack)
            if (blackjack[0]>blackjack[1]) {
                clearTimeout(timer)
                setTimeout(function(){game_result(3)},1400)
            } else if (blackjack[0]<blackjack[1]) {
                clearTimeout(timer)
                setTimeout(function(){game_result(2)},1400)
            } else if(blackjack[0]+blackjack[1] == 2) {
                clearTimeout(timer)
                setTimeout(function(){game_result(-1)},1400)
            } else if (total[1]>21) {
                clearTimeout(timer)
                setTimeout(function(){game_result(1)},1400) 
            } else if (total[0] < total[1]) {
                clearTimeout(timer)
                setTimeout(function(){game_result(0)},1400)
            } else if(total[0]==total[1]) {
                clearTimeout(timer)
                setTimeout(function(){game_result(-1)},1400)
            } else {
                clearTimeout(timer)
                setTimeout(function(){game_result(1)},1400)
            }
        }
    })
}

function reset() {
    deck = []
    d_deck = []
    p_deck = []
    total = [0,0,0,0]
    for (i = 0; i < 13; i++) {
        deck.push("h" + numbers[i])
        deck.push("c" + numbers[i])
        deck.push("s" + numbers[i])
        deck.push("d" + numbers[i])
    }
    
    shuffle(deck)

    $("#dealer").empty()
    $("#player").empty()
}

function game_result(status) {
    if (status == 0) {
        $("#result").html("<p>딜러 승리</p><p>플레이어: " + total[0] + "점<br>딜러: " + total[1] + "점</p><button onclick='reset()'>다시 시작하기</button>")
    } else if (status == 1) {
        $("#result").html("<p>플레이어 승리</p><p>플레이어: " + total[0] + "점<br>딜러: " + total[1] + "점</p><p>+ " + inputValue + "</p><button onclick='reset()'>다시 시작하기</button>")
    } else if(status>1) {
        if (status == 2) {
            $("#result").html("<p>딜러 승리</p><p>딜러: blackjack</p><button onclick='reset()'>다시 시작하기</button>")
        } else {
            $("#result").html("<p>플레이어 승리</p><p>플레이어: blackjack</p><button onclick='reset()'>다시 시작하기</button>")
        }
    } else {
        $("#result").html("<p>무승부</p><p>플레이어: " + total[0] + "점<br>딜러: " + total[1] + "점</p><button onclick='reset()'>다시 시작하기</button>")
    }
    $("#result").css("display", "flex")

    $("#betPrice").css("display", "none")
    $("#playerPoint").css("display", "none")
    $("#dealerPoint").css("display", "none")
    $("#hit").css("display", "none")
    $("#stand").css("display", "none")
}

function reset() {
    window.location.reload()
}
