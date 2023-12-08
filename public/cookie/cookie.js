class GameModel {
  constructor() {
    this.score = 0;
    this.productionRate = 0;
    this.cookiesPerClick = 1;
    this.upgrades = [
      { name: "Small Oven", cost: 15, production: 1, count: 0 },
      { name: "Bigger Oven", cost: 100, production: 5, count: 0 },
      { name: "Industrial Oven", cost: 500, production: 20, count: 0 },
      { name: "Bakery Line", cost: 3000, production: 100, count: 0 },
      { name: "Cookie Factory", cost: 10000, production: 400, count: 0 },
      { name: "Cookie Robots", cost: 40000, production: 1500, count: 0 },
      { name: "Cookie Mines", cost: 200000, production: 6500, count: 0 },
      { name: "Cookie Islands", cost: 1000000, production: 30000, count: 0 },
      { name: "Cookie Planets", cost: 5000000, production: 100000, count: 0 },
      {
        name: "Galactic Cookies",
        cost: 20000000,
        production: 500000,
        count: 0,
      },
    ];
    this.clickUpgrades = [
      { name: "Double Click", cost: 50, increasePerClick: 2 },
      { name: "Triple Click", cost: 150, increasePerClick: 3 },
      { name: "Ultra Click", cost: 500, increasePerClick: 5 },
      { name: "Mega Click", cost: 1000, increasePerClick: 10 },
      { name: "Super Click", cost: 5000, increasePerClick: 20 },
      { name: "Hyper Click", cost: 20000, increasePerClick: 50 },
      { name: "Ultra Mega Click", cost: 50000, increasePerClick: 100 },
      { name: "Time Warp Click", cost: 100000, increasePerClick: 200 },
      { name: "Quantum Click", cost: 500000, increasePerClick: 500 },
      { name: "Galactic Click", cost: 1000000, increasePerClick: 1000 },
    ];
  }

  buyUpgrade(upgrade) {
    if (this.score >= upgrade.cost) {
      this.score -= upgrade.cost;
      upgrade.count++;
      this.productionRate += upgrade.production;
    }
  }

  buyClickUpgrade(upgrade) {
    if (this.score >= upgrade.cost) {
      this.score -= upgrade.cost;
      this.cookiesPerClick += upgrade.increasePerClick;
    }
  }

  incrementScore() {
    this.score += this.cookiesPerClick;
  }

  updateProduction() {
    this.score += this.productionRate;
  }
}

class GameView {
  constructor(model) {
    this.model = model;
    this.cookieScore = document.getElementById("cookie-score");
    this.cookiesPerClickElement = document.getElementById("cookies-per-click");
    this.cookiesPerSecondElement = document.getElementById("cookies-per-second");
    this.upgradeList = document.getElementById("upgrade-list");
    this.clickUpgradeList = document.getElementById("click-upgrade-list");
  }

  updateScore() {
    const formattedScore = this.abbreviateNumber(this.model.score);
    this.cookieScore.textContent = `Cookies: ${formattedScore}`;
    this.cookiesPerSecondElement.textContent = `${this.abbreviateNumber(this.model.productionRate)}`;
    this.animateScore();
  }

  updateCookiesPerClickDisplay() {
    const formattedScore = this.abbreviateNumber(this.model.cookiesPerClick);
    this.cookiesPerClickElement.textContent = formattedScore;
  }

  renderUpgrades() {
    this.upgradeList.innerHTML = "";
    let gameModel = this.model;
    let view = this;
    gameModel.upgrades.forEach((upgrade) => {
      const li = document.createElement("li");
      li.classList.add("upgrade-item");
      li.textContent = `${upgrade.name} - Cost: ${upgrade.cost}, Production: ${upgrade.production}, Owned: ${upgrade.count}`;
      li.addEventListener("click", function () {
        gameModel.buyUpgrade(upgrade);
        view.updateScore();
        view.renderUpgrades(); // 업그레이드 목록을 다시 렌더링하여 보유 개수 업데이트
      });
      this.upgradeList.appendChild(li);
    });
  }

  renderClickUpgrades() {
    const clickUpgradeList = document.getElementById("click-upgrade-list");
    clickUpgradeList.innerHTML = "";
    let gameModel = this.model;
    let view = this;
    gameModel.clickUpgrades.forEach((upgrade) => {
      const li = document.createElement("li");
      li.classList.add("upgrade-item");
      li.textContent = `${upgrade.name} - Cost: ${upgrade.cost}, Increase Per Click: ${upgrade.increasePerClick}`;
      li.addEventListener("click", function () {
        gameModel.buyClickUpgrade(upgrade);
        // view.updateCookiesPerClickDisplay();
        view.updateScore();
        view.updateCookiesPerClickDisplay();
      });
      clickUpgradeList.appendChild(li);
    });
  }

  animateScore() {
    this.cookieScore.classList.add("number-animate");
    setTimeout(() => this.cookieScore.classList.remove("number-animate"), 500);
  }

  abbreviateNumber(value) {
    let newValue = value;
    if (value >= 1000) {
      const suffixes = ["", "K", "M", "B", "T"];
      const suffixNum = Math.floor(("" + value).length / 3);
      let shortValue = "";
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        const dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }
}

class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    document.getElementById("cookie-button").addEventListener("click", () => {
      this.model.incrementScore();
      this.view.updateScore();
    });

    setInterval(() => {
      this.model.updateProduction();
      this.view.updateScore();
      this.view.updateCookiesPerClickDisplay();
    }, 1000);

    // 업그레이드 및 클릭 업그레이드 이벤트 리스너 추가
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const model = new GameModel();
  const view = new GameView(model);
  const controller = new GameController(model, view);

  view.renderUpgrades();
  view.renderClickUpgrades();
});
