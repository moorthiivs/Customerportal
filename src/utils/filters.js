export const filterbymake = (query, options) => {
  return options.filter((item) => {
    const regex = new RegExp(query, "i");
    return regex.test(item.make);
  });
};

export const filterbysrfNo = (query, options) => {
  return options.filter((item) => {
    const regex = new RegExp(query, "i");
    return regex.test(item.srfId);
  });
};
export const filterbyName = (query, options) => {
  return options.filter((item) => {
    const regex = new RegExp(query, "i");
    return regex.test(item.name);
  });
};

export const filterbymodel = (query, options) => {
  return options.filter((item) => {
    const regex = new RegExp(query, "i");
    return regex.test(item.model);
  });
};

export const filterbyserialno = (query, options) => {
  return options.filter((item) => {
    const regex = new RegExp(query, "i");
    return regex.test(item.serialno);
  });
};

export const filterbyidno = (query, options) => {
  return options.filter((item) => {
    const regex = new RegExp(query, "i");
    return regex.test(item.idno);
  });
};
