import { registerBlockType } from '@wordpress/blocks';
import './index.scss';
import {
  TextControl,
  Flex,
  FlexBlock,
  FlexItem,
  Button,
  Icon,
  PanelBody,
  PanelRow,
} from '@wordpress/components';
import {
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';

// IIFE - Immediately Invoked Function Expression
(function () {
  let locked = false;
  // wp.data.subscribe check for changes in the editor every time it changes
  wp.data.subscribe(function () {
    //  results returns an array of blocks that correctAnswer is undefined
    const results = wp.data
      .select('core/block-editor')
      .getBlocks()
      .filter(function (block) {
        return (
          block.name == 'ourplugin/are-you-paying-attention' &&
          block.attributes.correctAnswer == undefined
        );
      });
    // lock the button is results is not empty AND locked is false
    if (results.length && locked == false) {
      locked = true;
      // noanswer is a string that is passed to the lockPostSaving function
      // could be anything
      wp.data.dispatch('core/editor').lockPostSaving('noanswer');
    }

    if (!results.length && locked) {
      locked = false;
      wp.data.dispatch('core/editor').unlockPostSaving('noanswer');
    }
  });
})();
// wp add to browswer global scope
// inside the object has blocks etc
// inside object there is registerBlockType()

// 1st argument is the name or variable of the block
// 2nd argument is a config object that has a bunch of properties
registerBlockType('ourplugin/are-you-paying-attention', {
  // wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
  // properties here is precise or exact property names that wordpress know to look for
  title: 'Are you paying attention?',
  icon: 'admin-comments',
  category: 'layout',
  attributes: {
    question: { type: 'string' },
    answers: { type: 'array', default: [''] },
    correctAnswer: { type: 'number', default: undefined },
    bgColor: { type: 'string', default: '#ffffff' }, // Add this
  },
  // edit function control what you see in the admin post editor screen
  edit: EditComponent,
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
});

function EditComponent(props) {
  //createElement wordpress method
  function updateQuestion(value) {
    props.setAttributes({ question: value });
  }

  function handleDelete(index) {
    let newAnswers = props.attributes.answers.filter((_, i) => i !== index);
    props.setAttributes({ answers: newAnswers });
    // delete if correct answer is deleted
    if (props.attributes.correctAnswer === index) {
      props.setAttributes({ correctAnswer: undefined });
    }

    console.log('Block is rendering');
  }

  function markAsCorrect(index) {
    props.setAttributes({ correctAnswer: index });
  }
  return (
    <div className="paying-attention-edit-block">
      {/* <BlockControls>
        <AlignmentToolbar
          value={props.attributes.theAlignment}
          onChange={(x) => props.setAttributes({ theAlignment: x })}
        />
      </BlockControls>
      <InspectorControls>
        <PanelBody title="Background Color" initialOpen={true}>
          <PanelRow>
            hello!
            <ChromePicker
              color={props.attributes.bgColor}
              onChangeComplete={(x) => props.setAttributes({ bgColor: x.hex })}
              disableAlpha={true}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls> */}
      <TextControl
        style={{ fontSize: '20px' }}
        value={props.attributes.question}
        onChange={updateQuestion}
      />
      <p style={{ fontSize: '13px', margin: '20px 0 8px 0' }}>Answers:</p>
      {props.attributes.answers.map((answer, index) => {
        return (
          <Flex key={index}>
            <FlexBlock>
              <TextControl
                autoFocus={answer == undefined}
                value={answer}
                onChange={(value) => {
                  // array of answers
                  const newAnswers = [...props.attributes.answers];
                  newAnswers[index] = value;
                  props.setAttributes({ answers: newAnswers });
                }}
              />
            </FlexBlock>
            <FlexItem>
              <Button onClick={() => markAsCorrect(index)}>
                <Icon
                  className="mark-as-correct"
                  icon={
                    props.attributes.correctAnswer == index
                      ? 'star-filled'
                      : 'star-empty'
                  }
                />
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                isLink
                className="attention-delete"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        );
      })}
      <Button
        isPrimary
        onClick={() => {
          props.setAttributes({
            // create a new array with a valuie of undefined (empty field)
            answers: [...props.attributes.answers, undefined],
          });
        }}
      >
        Add another answer?
      </Button>
    </div>
  );
}
