import SEO from '../../../middlewares/SEO';

const NewCustomOrders = () => {
  return (
    <>
      <SEO
        title="Create a new Custom Order"
        description="Create a new custom order for your customers or yourself"
      />
      <div>
        <h1>Create a custom order</h1>
        <div>
          <p>
            Use this form to create a new custom order. Fill in the details
            below and submit your order.
          </p>

          <div>
            <label htmlFor="">Products names</label>*
            <input type="text" name="" id="" />
          </div>

          <div>
            <label htmlFor="">Products description</label>*
            <p>
              Full describe how the products you need are specified, and mention
              all customizations needed
            </p>
            <input type="text" name="" id="" />
          </div>

          <div>
            <label htmlFor="">Expected delivery date</label>*
            <input type="date" name="" id="" />
          </div>
          <div>
            <label htmlFor="">Budget</label>*
            <input type="number" name="" id="" />
          </div>
          <div>
            <button>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCustomOrders;
