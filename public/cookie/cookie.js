class GameModel {
  constructor() {
    this.score = 0;
    this.productionRate = 0;
    this.cookiesPerClick = 1;
    this.upgrades = [
      { name: "Small Oven", cost: 10, production: 1, count: 0 },
      { name: "Bigger Oven", cost: 15, production: 10, count: 0 },
      // 추가 업그레이드
    ];
    this.clickUpgrades = [
      { name: "Double Click", cost: 2, increasePerClick: 2 },
      { name: "Triple Click", cost: 5, increasePerClick: 3 },
      // 추가 클릭 업그레이드
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
    this.upgradeList = document.getElementById("upgrade-list");
    this.clickUpgradeList = document.getElementById("click-upgrade-list");
  }

  updateScore() {
    const formattedScore = this.abbreviateNumber(this.model.score);
    this.cookieScore.textContent = `Cookies: ${formattedScore}`;
    this.animateScore();
  }

  updateCookiesPerClickDisplay() {
    const formattedScore = this.abbreviateNumber(this.model.cookiesPerClick);
    const cookiesPerClickElement = document.getElementById("cookies-per-click");
    cookiesPerClickElement.textContent = formattedScore;
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
