var bindEventData = function (data, list) {
    let event_list = [...list]
    if (data.event_type == "CARDHOLDER") {
        let findCard = event_list.find((c) => c.event_type == "CARDHOLDER");
        if (findCard && findCard.event_qty) {
            findCard.event_qty++;
        } else {
            event_list.push({
                event_qty: 1,
                event_type: "CARDHOLDER",
            });
        }
    } else if (data.event_type == "CARDHOLDER-ALARM") {
        let findCard = event_list.find(
            (c) => c.event_type == "CARDHOLDER-ALARM"
        );
        if (findCard && findCard.event_qty) {
            findCard.event_qty++;
        } else {
            event_list.push({
                event_qty: 1,
                event_type: "CARDHOLDER-ALARM",
            });
        }
    } else if (data.event_type == "USER") {
        let findCard = event_list.find((c) => c.event_type == "USER");
        if (findCard && findCard.event_qty) {
            findCard.event_qty++;
        } else {
            event_list.push({
                event_qty: 1,
                event_type: "USER",
            });
        }
    } else if (data.event_type == "SYSTEM") {
        let findCard = event_list.find((c) => c.event_type == "SYSTEM");
        if (findCard && findCard.event_qty) {
            findCard.event_qty++;
        } else {
            event_list.push({
                event_qty: 1,
                event_type: "SYSTEM",
            });
        }
    }

    return event_list;
}



export { bindEventData };
