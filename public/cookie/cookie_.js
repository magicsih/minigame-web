document.addEventListener("DOMContentLoaded", function () {
  const cookieButton = document.getElementById("cookie-button");
  const cookieScore = document.getElementById("cookie-score");
  const upgradeList = document.getElementById("upgrade-list");
  let score = 0;
  let productionRate = 0;
  let cookiesPerClick = 1; // 클릭당 쿠키 증가량 기본값

  const upgrades = [
    { name: "Small Oven", cost: 10, production: 1, count: 0 },
    { name: "Bigger Oven", cost: 15, production: 10, count: 0 },
    // 더 많은 업그레이드 아이템 추가 가능
  ];

  const clickUpgrades = [
    { name: "Double Click", cost: 2, increasePerClick: 2 },
    { name: "Triple Click", cost: 5, increasePerClick: 3 },
    // 더 많은 클릭 업그레이드 아이템 추가 가능
  ];

  function updateScore() {
    const formattedScore = abbreviateNumber(score);
    cookieScore.textContent = `Cookies: ${formattedScore}`;
    cookieScore.classList.add("number-animate");
    setTimeout(() => cookieScore.classList.remove("number-animate"), 500);
  }

  function updateCookiesPerClickDisplay() {
    const cookiesPerClickElement = document.getElementById("cookies-per-click");
    cookiesPerClickElement.textContent = cookiesPerClick;
  }

  function buyClickUpgrade(upgrade) {
    if (score >= upgrade.cost) {
      score -= upgrade.cost;
      cookiesPerClick += upgrade.increasePerClick;
      updateScore();
      updateCookiesPerClickDisplay(); // 업그레이드 후 'cookiesPerClick' 값을 업데이트
    }
  }

  function buyUpgrade(upgrade) {
    if (score >= upgrade.cost) {
      score -= upgrade.cost;
      upgrade.count++;
      productionRate += upgrade.production;
      updateScore();
      renderUpgrades(); // 업그레이드 목록을 다시 렌더링하여 보유 개수 업데이트
    }
  }

  function renderUpgrades() {
    upgradeList.innerHTML = "";
    upgrades.forEach((upgrade) => {
      const li = document.createElement("li");
      li.classList.add("upgrade-item");
      li.textContent = `${upgrade.name} - Cost: ${upgrade.cost}, Production: ${upgrade.production}, Owned: ${upgrade.count}`;
      li.addEventListener("click", function () {
        buyUpgrade(upgrade);
      });
      upgradeList.appendChild(li);
    });
  }

  function renderClickUpgrades() {
    const clickUpgradeList = document.getElementById("click-upgrade-list");
    clickUpgradeList.innerHTML = "";
    clickUpgrades.forEach((upgrade) => {
      const li = document.createElement("li");
      li.classList.add("upgrade-item");
      li.textContent = `${upgrade.name} - Cost: ${upgrade.cost}, Increase Per Click: ${upgrade.increasePerClick}`;
      li.addEventListener("click", function () {
        buyClickUpgrade(upgrade);
      });
      clickUpgradeList.appendChild(li);
    });
  }

  function abbreviateNumber(value) {
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

  cookieButton.addEventListener("click", function () {
    score += cookiesPerClick;
    updateScore();
  });

  setInterval(() => {
    score += productionRate;
    updateScore();
  }, 1000); // 매초마다 점수 증가

  renderUpgrades();
  renderClickUpgrades();
});
