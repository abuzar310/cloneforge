# Hero Specification

## Overview
- **Target file:** `src/components/wembi/Hero.tsx`
- **Screenshot:** `docs/design-references/wembi.ai/desktop-full.png`
- **Interaction model:** static + time-driven (video loop)

## Computed Styles (from getComputedStyle @ 1440)
### Container `.hero`
- backgroundColor: rgb(192, 223, 233) / video cover
- padding: 37.5px
- margin: 18.75px
- borderRadius: 10.5px
- display: flex

### `.hero__minititle`
- fontSize: 12px
- fontFamily: HaasUnicaSH-Medium
- color: rgb(190, 255, 139) (#beff8b)
- marginBottom: 45px
- display: flex

### `.hero__text`
- fontSize: 97.5px
- lineHeight: 107.25px
- fontFamily: HaasUnicaSH-Regular
- color: #beff8b

## Assets
- Video: `public/videos/wembi/home.webm`
- Poster/fallback: `public/images/wembi/1_HEADER_WEMBI_42e842a611.jpg`
- Logo: `public/images/wembi/logo.svg`

## Real Content
- Minititle: N°001 / Il Gemello Digitale di ogni cosa
- Body: Wembi migliora all'istante le performance di qualsiasi dispositivo, macchinario o apparato digitale attraverso la creazione della sua replica virtuale.

## Responsive
- Desktop: large fluid type, logo top
- Mobile: type scales down via clamp; stacked layout
