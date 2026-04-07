const { Company } = require("../models")

exports.postCompanyData = async (req, res) => {
  try {
    const customers = req.body;
    let updated_count = 0;

    for (const eachcustomers of customers) {

      const { customer_id, customer_name, address1, address2, address3, rstatus, lab_id, calibmaster_customer_id, customer_contact } = eachcustomers;

      const existingCompany = await Company.findOne({
        where: { calibmaster_customer_id },
      });

      if (!existingCompany) {
        let creation_data = {
          id: customer_id,
          companyname: customer_name,
          email: customer_contact.contact_email,
          address1,
          address2,
          address3,
          labId: lab_id,
          calibmaster_customer_id,
          rstatus,
        };

        const newCustomer = await Company.create(creation_data)
        updated_count++;
      }
    }
    if (!updated_count) {
      return res.status(201).json({ message: "All customer data is up to date!" });
    }
    res.status(200).json({ message: `Customers data synced successfully! Synced count:${updated_count}` });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
