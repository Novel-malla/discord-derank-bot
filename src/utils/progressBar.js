function progressBar(percent) {

    const total = 20;

    const filled =
        Math.round(percent / 100 * total);

    return (
        "█".repeat(filled) +
        "░".repeat(total - filled)
    );

}

module.exports = progressBar;