// エラーチェックをより厳格化するため
'use strict';

// 配列 cardsを作成
const cards=[];
// suits(組、組札、同じ組の持ち札)配列を作成
const suits=['s','d','h','c'];
// カードを裏表示か表表示かを判断するためのカウント 0：裏表示　１：表表示　
let count = 0;
// トランプのランダムな数字を取得する。(if分のそれぞれで宣言するのを防ぐため。dealerHand.push(randomCard.num);を１回のみ記述にするため)
let randomCard = 0;
// プレイヤーの手札
let playerHands = [];
// ディーラーの手札
let dealerHand = [];
// プレイヤーの手札の合計
let playerSum = 0;
// ディーラーの手札の合計
let dealerSum = 0;
// resultを実行したどうかを判定する　0: result関数を未実行 1:result関数を実行済み
let result_count = 0;
// プレイヤーかを判定する変数　０の場合は：　プレイヤー　１の場合は：　ディーラー
let isPlayer = 0;


// 1.盤上で、ディーラーとプレイヤーに２枚ずつカードが配られる。
// 　（ディーラーはそのうち一枚だけ裏向き。）

// 画面が開いた時に実行する関数
window.onload=function(){
  // 52枚のカードを作成する
  cardSet();
  // カードを配る関数を２回実行する
  dealCard()
  dealCard()
}



// 2.プレイヤーは好きな枚数分カードを追加できます。
// 　（カードの合計値が21を超えてしまったらその時点でプレイヤーの負け）

function hit() {
  // ２１より小さい場合は、setPlayerHand関数を実行する
  if (playerSum < 21) {
    setPlayerHand();
  }
  // 21よりプレーヤーの手札が大きいかつresult_countが0の場合はresult関数を実行する(result_countは結果表示を１回にするため)
  if (playerSum > 21 && result_count === 0) {
    const back = document.querySelector('.back');
    back.classList.remove('back');
    result_count += 1;
    result();
  }
}

// 3.プレイヤーがカードをもう追加しない場合、ディーラーの番になります。

// 4.ディーラーは裏向きのカードを表向きにし、
// 　カードの合計値が17を超えるまでカードを追加しなければなりません。
// 　（カードの合計値が21を超えてしまったらその時点でディーラーの負け）

function stand() {
  // ディーラーの裏側表示のカード要素を取得する
  const back = document.querySelector('.back');
  // カードのクラスを取り除く
  back.classList.remove('back');
  // ディーラーは18より小さい間はsetDealerHand関数を実行する　それ以外はresult関数を実行する
  if (dealerHand < 18) {
    setDealerHand();
  } else {
    result();
  }
}

// 5.お互いのカードを合計値を比較し、勝ち・負け・引き分けの判定をします。

function result() {
  // 結果を表示したかを判定する変数
  result_count += 1;
  const gameResult = document.getElementById('game-result');
  let div = document.createElement('div');

  if (playerSum > 21 || playerHands < dealerHand ) {
    div.textContent = "負け"
  } else if ( dealerHand > 21 || playerHands > dealerHand) {
    div.textContent = "勝ち"
  }else {
    div.textContent = "引き分け"
  }
  gameResult.appendChild(div);
}



// カードオブジェクト


// コンストラクタ関数を書くことでオブジェクトの種類を定義する（Card）
function Card(suit,num){
  // suitプロパティ（情報）をもたせます。
  // オブジェクトのプロパティに値を代入するために this を使用
  this.suit=suit;
  // numプロパティを持たせます
  // オブジェクトのプロパティに値を代入するために this を使用
  this.num=num;
  // そのカードが持つfrontを宣言する
  this.front;
  // 関数の機能をsetFrontに代入する
  this.setFront=function(){
    // this.frontに代入する
    // もしthis.numが10より小さい場合は 0 それ以外は何もしない
    //(例) s01 s02 s03... s13
    //(例) d01 d02 d03... d13
    //(例) h01 h02 h03... h13
    //(例) c01 c02 c03... c13
    // .gifは共通とする
    this.front=`${this.suit}${this.num<10?'0':''}${this.num}.gif`;
  };
}

// カードを５２枚画像と一緒にセットする関数


function cardSet() {
  // suitsの配列分回す（４回）
  for(let i=0;i<suits.length;i++){
    // tableの13列を作成
    for(let j=1;j<=13;j++){
      // カードをインスタンス化する(例：suits[0],1 suits[0],2.....)
      let card=new Card(suits[i],j);
      // cardにsetFront関数を実行する
      card.setFront();
      // カード配列の末尾に代入する
      // suits[0]の場合はs suits[1]の場合はd suits[2]の場合はh suits[3]の場合はc
      // それぞれに１〜１３までの数字がある
      cards.push(card);
    }
  }
}


// カード配る関数

function dealCard() {
  // ディーラーの手札を作成する関数を実行する
  setDealerHand();
  // プレーヤーの手札を作成する関数を実行する
  setPlayerHand()
}


// ディーラーの手札を作成する関数


function setDealerHand() {

  // トランプのランダムな数字を取得する。(if分のそれぞれで宣言するのを防ぐため。dealerHand.push(randomCard.num);を１回のみ記述にするため)
  randomCard = 0;

  // カードが裏表示の処理
  if (count === 0) {
     // dealer-resultの要素を取得する
    let dealerResult = document.getElementById('dealer-result');
    // divを作成する
    let div = document.createElement('div');
    // divのクラスにcardとbackを追加する
    div.classList.add('card','back');
    // cardLengthにはカードの長さが入る（52が入る)
    const cardLength = cards.length;
    // 1~から51までの数を取得する(indexの値は0~51までのため）
    let randomIndex = Math.floor(Math.random() * cardLength);
    // ランダムな一枚のカードを取得する（cardsの中に５２枚のカードがあるのでその中の１枚のカードをランダムに取り出す）
    randomCard=cards[randomIndex];
    // ランダムな数字を取得する（手札にランダムな数字を取得するため）
    div.num=randomCard.num;
    // ランダラムで取得したカードに適した画像を取得する
    div.style.backgroundImage=`url(images/${randomCard.front})`;
    // dealerResultの子要素にdivを入れる
    dealerResult.appendChild(div);
    // カウントをアップさせる 裏での表示をする処理にするかを分けるため
    count = 1;

    // カードが表表示の処理
  }else{
    // dealer-resultの要素を取得する
    const dealerResult = document.getElementById('dealer-result');
    // divを作成する
    let div = document.createElement('div');
    // divのクラスにcardとbackを追加する
    div.classList.add('card');
    // cardLengthにはカードの長さが入る（52が入る)
    const cardLength = cards.length;
    // 1~から51までの数を取得する(indexの値は0~51までのため）
    let randomIndex = Math.floor(Math.random() * cardLength);
    // ランダムな一枚のカードを取得する（cardsの中に５２枚のカードがあるのでその中の１枚のカードをランダムに取り出す）
    randomCard=cards[randomIndex];
    // ランダラムで取得したカードに適した画像を取得する
    div.style.backgroundImage=`url(images/${randomCard.front})`;
    // dealerResultの子要素にdivを入れる
    dealerResult.appendChild(div);
  }
  // １のカードを引いた時に実行される
  if (randomCard.num === 1) {
    // プレイヤーの手札が１の時に１か１１を選択する関数
    randomCard.num = OneOrEleven(randomCard,1);
  }
  // ディーラーの手札の合計値
  dealerSum += randomCard.num;
  // ディーラーの手札に数字を入れる
  dealerHand.push(randomCard.num);
}


// プレーヤーの手札を作成する関数

function setPlayerHand() {

  randomCard = 0;

    // dealer-resultの要素を取得する
  const playerResult = document.getElementById('player-result');
  // divを作成する
  let div = document.createElement('div');
  // divのクラスにcardとbackを追加する
  div.classList.add('card');
  // cardLengthにはカードの長さが入る（52が入る)
  const cardLength = cards.length;
  // 1~から51までの数を取得する(indexの値は0~51までのため）
  let randomIndex = Math.floor(Math.random() * cardLength);
  // ランダムな一枚のカードを取得する（cardsの中に５２枚のカードがあるのでその中の１枚のカードをランダムに取り出す）
  randomCard=cards[randomIndex];
  // ランダラムで取得したカードに適した画像を取得する
  div.style.backgroundImage=`url(images/${randomCard.front})`;
  // dealerResultの子要素にdivを入れる
  playerResult.appendChild(div);
  // プレイヤーの手札に数字を入れる(カードの数字が１０以上だったら１０として扱う)
  if (randomCard.num >= 10) {
    randomCard.num = 10;
  }
  // １のカードを引いた時に実行される
  if (randomCard.num === 1) {
    // プレイヤーの手札が１の時に１か１１を選択する関数
    randomCard.num = OneOrEleven(randomCard,0);
  }
  // プレイヤーの手札の合計値
  playerSum += randomCard.num;
  // ディーラーの手札に数字を入れる
  playerHands.push(randomCard.num);

}




// ーーーーーーーーーー以下修正後ーーーーーーーーーー



// １を数字の１か１１かを選択する関数


function OneOrEleven(randomCard,isPlayer) {
  let isBurst = 0;
  // ランダムな数字が１だった時（１か１１かを選択する処理)
  if (randomCard.num === 1) {
    if (isPlayer === 0) {
      // この時のsumは１が入る前の合計値　isBurstは１１を選択した場合の合計値
      isBurst = playerSum + 11;
    } else {
      // この時のsumは１が入る前の合計値　isBurstは１１を選択した場合の合計値
      isBurst = dealerSum + 11;
    }
    // もし２１より大きかったら１が選択される
    if (isBurst > 21) {
      return 1;
      // それ以外(合計値が２１より大きくならない場合　バーストしない場合)
    }else {
      return 11;
    }
  }
}



// ーーーーーーーーーー以下修正前ーーーーーーーーーー





// // ディーラーの手札が１か１１の時


// function dealerOneOrEleven() {
//   let isBurst = 0;
//   // ランダムな数字が１だった時（１か１１かを選択する処理)
//   if (randomCard.num === 1) {
//     // この時のsumは１が入る前の合計値　isBurstは１１を選択した場合の合計値
//     isBurst = dealerSum + 11;
//     // もし２１より大きかったら１が選択される
//     if (isBurst > 21) {
//       randomCard.num = 1;
//       // それ以外(合計値が２１より大きくならない場合　バーストしない場合)
//     }else {
//       randomCard.num = 11;
//     }
//   }
// }


// // プレイヤーの手札が１か１１の時


// function playerOneOrEleven() {
//   let isBurst = 0;
//   // ランダムな数字が１だった時（１か１１かを選択する処理)
//   if (randomCard.num === 1) {
//     // この時のsumは１が入る前の合計値　isBurstは１１を選択した場合の合計値
//     isBurst = playerSum + 11;
//     // もし２１より大きかったら１が選択される
//     if (isBurst > 21) {
//       randomCard.num = 1;
//       // それ以外(合計値が２１より大きくならない場合　バーストしない場合)
//     }else {
//       randomCard.num = 11;
//     }
//   }
// }


