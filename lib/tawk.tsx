import Script from 'next/script'

/* eslint-disable-next-line */
export interface TawkProps {
  src: string
}

export default function Tawk(props: TawkProps) {
  return (
    <Script
    id="tawk_tag"
      strategy='lazyOnload'
      dangerouslySetInnerHTML={{
        __html:`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='${props.src}';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();`
      }}
    />
  );
}