import { useState, useEffect } from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, Container, IconButton, Stack, Button, MenuItem, TextField, Tooltip, Typography, Link } from "@mui/material";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Languages } from './languages';
import axios from "axios";
import { API_KEY } from './key';
function App() {

  const [firstlang, setFirstlang] = useState("en");
  const [secondlang, setSecondlang] = useState("te");
  const [firstlangtext, setFirstlangtext] = useState("");
  const [secondlangtext, setSecondlangtext] = useState("");
  const [disablebuttons, setDisablebuttons] = useState({
    file: false,
    translate_button: true
  })
  const [isfetching, setIsfetching] = useState(false);
  const [showfirsttooltip, setShowfirsttooltip] = useState(false);
  const [showsecondtooltip, setShowsecondtooltip] = useState(false);
  async function openFile() {
    const options = {
      multiple: false,
      types: [
        {
          description: 'text files',
          accept: {
            'text/plain': ['.txt']
          }
        }
      ]
    }
    try {
      const filespile = await window.showOpenFilePicker(options);
      //const file = await fileHandle.getFile();
      // Do something with the selected file
      console.log(filespile[0].getFile())
      const fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        console.log(e.target.result)
      }
      //fileReader.readAsText(file)
    } catch (err) {
      console.error('Error accessing file:', err);
    }
  }

  /**function to convert text to speech mode */
  const text_to_speech = (txt) => {
    const speak = window.speechSynthesis;
    const utternace = new SpeechSynthesisUtterance();
    utternace.text = txt
    utternace.lang = 'en-IN'
    utternace.voice = speak.getVoices()[286]
    speak.speak(utternace)
  }
  /**function to copty the text to clipboard */
  const text_to_copy = async (txt) => {
    await navigator.clipboard.writeText(txt)
      .then(() => {
        console.log("text copied succesfully");
      })
      .catch(err => console.log(err.message))
  }


  useEffect(() => {
    if (firstlangtext.length > 0) {
      setDisablebuttons({
        file: true,
        translate_button: false,
      })
    }
    else {
      setDisablebuttons({
        file: false,
        translate_button: true
      })

    }
  }, [firstlangtext])


  const styles = {
    textarea: {
      resize: 'none',
      height: 250,
      width: 300,
      borderRadius: 2,
      padding: 2,
      lineHeight: 1.8,
      border: 'none',
      fontSize: 22,
      fontFamily: 'helvetica',
      "&::placeholder": {
        fontSize: 22,
        fontFamily: 'helvetica'
      },
      "&:focus": {
        border: 'none',
        outline: 'none'
      }
    }
  }


  const translate_text = async () => {
    setIsfetching(true);
    const encodedParams = new URLSearchParams();
    encodedParams.set('from', firstlang);
    encodedParams.set('to', secondlang);
    encodedParams.set('text', firstlangtext);
    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      setSecondlangtext(response.data.trans);
      setIsfetching(false)
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <Container sx={{
      marginBlockStart: { xs: 2, sm: 2.5, lg: 8 }
    }}>

      <Stack direction="row" justifyContent={"center"} alignItems="center" spacing={2}>
        <TextField
          id="episodelabel"
          value={firstlang}
          onChange={(e) => setFirstlang(e.target.value)}
          select
          sx={{
            width: 300,
            color: 'steelblue'
          }}
          SelectProps={{
            MenuProps: {
              style: {
                height: 400,
                left: -2,
                // Set the max height for the dropdown
              },
            },
          }}
          size="small"

        >

          {Languages.map((count, index) => {
            return (
              <MenuItem key={index} value={count.code}>
                {count.language}
              </MenuItem>

            );
          })}
        </TextField>
        <IconButton color="primary" onClick={() => {
          setFirstlang(secondlang);
          setSecondlang(firstlang);
          setFirstlangtext(secondlangtext)
          setSecondlangtext(firstlangtext)
        }}>
          <SwapHorizIcon />
        </IconButton>
        <TextField
          id="episodelabel"
          value={secondlang}
          onChange={(e) => setSecondlang(e.target.value)}
          select
          sx={{
            width: 300
          }}
          SelectProps={{
            MenuProps: {
              style: {
                height: 400,
                left: -2 // Set the max height for the dropdown
              },
            },
          }}
          size="small"
        >

          {Languages.map((count, index) => {
            return (
              <MenuItem key={index} value={count.code}>
                {count.language}
              </MenuItem>

            );
          })}
        </TextField>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'column', lg: 'row' }} justifyContent="center" alignItems="center"
        spacing={{
          sm: 1,
          xs: 1,
          lg: 5
        }}
        sx={{
          marginBlockStart: 3
        }}>
        <div style={{ position: 'relative' }}>
          <Box className="text-box">
            <Box component="textarea" sx={styles.textarea}
              placeholder="Enter Text"
              value={firstlangtext}
              onChange={(e) => {
                setFirstlangtext(e.target.value);
                const text_box = document.querySelector(".text-box");
                console.log(text_box.scrollHeight + text_box.clientHeight)

              }}
            />

          </Box>


          <Stack direction="row" justifyContent="start" alignItems="center" spacing={0.2}>
            <IconButton size="small" disabled={firstlangtext.length > 0 ? false : true} onClick={() => text_to_speech(firstlangtext)}>
              <KeyboardVoiceIcon />
            </IconButton>
            <IconButton size="small" disabled={disablebuttons.file} onClick={openFile}>
              <FilePresentIcon />
            </IconButton>
            <Tooltip title="text copied" arrow placement="top-end" open={showfirsttooltip} onClose={() => setShowfirsttooltip(false)}>
              <IconButton size="small" disabled={firstlangtext.length > 0 ? false : true} onClick={() => {
                text_to_copy(firstlangtext);
                setShowfirsttooltip(true)
              }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
        <div style={{ position: 'relative' }}>
          <Box component="textarea" sx={{ ...styles.textarea, backgroundColor: '#f8f9fa' }}
            placeholder="Translation"
            disabled
            value={secondlangtext}

          />
          <Stack direction="row" justifyContent="start" alignItems="center" spacing={0.2} onClick={() => text_to_speech(secondlangtext)}>
            <Tooltip title="text copied" arrow placement="top-end" open={showsecondtooltip} onClose={() => setShowsecondtooltip(false)}>
              <IconButton size="small" disabled={firstlangtext.length > 0 ? false : true} onClick={() => {
                text_to_copy(secondlangtext)
                setShowsecondtooltip(true)
              }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      </Stack>
      <Button size="small" variant="contained" sx={{
        width: { xs: '100%', sm: '100%', lg: 590 },
        display: 'block',
        margin: 'auto',
        marginBlockStart: 5
      }}
        disabled={disablebuttons.translate_button}
        onClick={translate_text}
      >{isfetching ? 'Translating...' : 'Translate'}</Button>
    </Container>
  )
}
export default App
