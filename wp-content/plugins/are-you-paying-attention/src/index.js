// wp add to browswer global scope
// inside the object has blocks etc
// inside object there is registerBlockType()

// 1st argument is the name or variable of the block
// 2nd argument is a config object that has a bunch of properties
wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
  // properties here is precise or exact property names that wordpress know to look for
  title: 'Are you paying attention?',
  icon: 'admin-comments',
  category: 'layout',
  attributes: {
    skyColor: { type: 'string' },
    grassColor: { type: 'string' },
  },
  // edit function control what you see in the admin post editor screen
  edit: function (props) {
    //createElement wordpress method
    function updateSkyColor(event) {
      props.setAttributes({ skyColor: event.target.value });
    }

    function updateGrassColor(event) {
      props.setAttributes({ grassColor: event.target.value });
    }

    return (
      <div>
        <input
          type="text"
          placeholder="sky color"
          onChange={updateSkyColor}
          value={props.attributes.skyColor}
        />
        <input
          type="text"
          placeholder="grass color"
          onChange={updateGrassColor}
          value={props.attributes.grassColor}
        />
      </div>
    );
  },
  // save function control what actual public will see in your content / frontend
  save: function (props) {
    //return wp.element.createElement('h1', null, 'this is the front end');
    // OMMENTED OUT DEPRECATED - use dynamic block instead
    // return (
    //   <h6>
    //     Today the sky is GGGGG {props.attributes.skyColor} and the grass is{' '}
    //     {props.attributes.grassColor}
    //   </h6>
    // return null to dynamically output content via PHP and the database
    return null;
  },
  // OMMENTED OUT DEPRECATED - use dynamic block instead
  // deprecated: [
  //   {
  //     attributes: {
  //       skyColor: { type: 'string' },
  //       grassColor: { type: 'string' },
  //     },
  //     save: function (props) {
  //       //return wp.element.createElement('h1', null, 'this is the front end');
  //       return (
  //         <h3>
  //           Today the sky is xxxx {props.attributes.skyColor} and the grass is{' '}
  //           {props.attributes.grassColor}
  //         </h3>
  //       );
  //     },
  //   },
  //   {
  //     attributes: {
  //       skyColor: { type: 'string' },
  //       grassColor: { type: 'string' },
  //     },
  //     save: function (props) {
  //       return (
  //         <p>
  //           Today the sky is {props.attributes.skyColor} and the grass is{' '}
  //           {props.attributes.grassColor}
  //         </p>
  //       );
  //     },
  //   },
  // ],
});
