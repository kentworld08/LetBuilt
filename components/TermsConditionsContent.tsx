import Link from "next/link";

export function TermsConditionsContent() {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
            <span className="text-orange-500">Terms &</span> Conditions
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>TERMS & CONDITIONS</span>
          </div>
        </div>

        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particles-container">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 12}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Company Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                LetBuilt
              </h2>
            </div>

            {/* Terms Content */}
            <div className="space-y-8 md:space-y-12">
              {/* Trademarks - Intellectual Property Rights */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Trademarks-Intellectual Property Rights
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  LetBuilt (the `Company`) is the owner of the Copyright in the
                  pages and in the screens displaying this website, and in the
                  information and material therein and in their arrangement,
                  unless otherwise indicated. The Company holds the exclusive
                  rights or license to use or any other license for all kinds of
                  trade names and trademarks contained and/or appearing in this
                  website.
                </p>
              </section>

              {/* Change of Information and Materials */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Change of Information and Materials
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  All information and materials contained in the website of the
                  Company, and all terms, conditions, prerequisites and
                  descriptions contained herein, are subject to change without
                  any prior notice.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Limitation of Liability
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
                  <p>
                    The Company does not provide any warranty as to the
                    accuracy, adequacy or completeness of the information and
                    materials contained in its websites and expressly rejects
                    any liability for any errors and/or omissions in this
                    regard. The Company does not provide any warranty of any
                    kind implied expressed or statutory, including but not
                    limited to the warranties of non-infringement of third party
                    rights, title, merchantability, fitness for a particular
                    purpose and freedom from computer virus, in conjunction with
                    the information and materials thereof.
                  </p>
                  <p>
                    Hyperlinks to other internet resources are followed at your
                    risk; the content, accuracy, opinions expressed and other
                    links provided by these resources are not controlled,
                    investigated, verified, monitored and/or endorsed by the
                    Company.
                  </p>
                  <p>
                    The Company shall not be liable for a) any damages, losses
                    or expenses which arise in connection to this website or its
                    use or inability to use by any person or in connection to
                    the inability to execute an order, error, omission,
                    interruption, fault, delay in operation or transmission,
                    computer viruses, communication failure or line or system
                    failure, even if the Company or its representatives have
                    been informed about the possibility of such damages, losses
                    or costs and b) for errors or inaccuracies in the
                    transmission process of data and/or Orders for CFDs and/or
                    Binary Options trading or any instructions from the
                    client/visitor of the site, interference, fraudulent
                    impersonation, breaking of secret access codes, erroneous
                    recording or transmission of message or system failure due
                    to force majeure or for whatever other reason which is not
                    due to breach of the above either by the Company.
                  </p>
                  <p>
                    The Company shall not be liable for any damage that may
                    occur to the hardware or software of the user that may arise
                    as a result of the use of this website and/or land or in
                    connection of this website with other websites/hypertest
                    links or internet resources.
                  </p>
                </div>
              </section>

              {/* Intended Users */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Intended Users
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  This website is not intended for any person or entity in any
                  jurisdiction or country where such distribution or use would
                  be contrary to local law or regulation.
                </p>
              </section>

              {/* Cookies */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Cookies
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
                  <p>
                    When you use our software, it will enable us to use cookies
                    in relation to your access to our website. Cookies are small
                    files of information, which often include a unique
                    identification number or value, which are stored on your
                    computer`s hard drive as a result of you using this trading
                    software and accessing the website. The purpose of this
                    information is to provide you with a more relevant and
                    effective experience on the website, including presenting
                    webpages according to your needs or preferences.
                  </p>
                  <p>
                    Cookies are frequently used on many websites on the internet
                    and you can choose if and how a cookie will be accepted by
                    changing your preferences and options in your browser. Some
                    of our business partners (e.g. advertisers) use cookies on
                    our website(s). We have no access to, or control over, these
                    cookies.
                  </p>
                  <p>
                    The cookies do not contain personally identifying
                    information nor are they used to identify you. You may
                    choose to disable the cookies. However, you may not be able
                    to access some parts of this website if you choose to
                    disable the cookie acceptance in your browser, particularly
                    the secure parts of the website.
                  </p>
                  <p>
                    For further information about cookies and how to disable
                    them, please refer to{" "}
                    <a
                      href="http://www.allaboutcookies.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 underline"
                    >
                      http://www.allaboutcookies.org
                    </a>
                  </p>
                </div>
              </section>

              {/* Third Party Links */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Third Party Links
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  Our website(s) contain links to websites operated by other
                  parties. We provide the links for your convenience, but we do
                  not review, control or monitor the privacy or other practices
                  of websites operated by other. We are not responsible for the
                  performance of websites operated by third parties or for your
                  business dealings with them.
                </p>
              </section>

              {/* Personal Data */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Personal Data
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
                  <p>I, the user of this website, hereby agree that:</p>
                  <div className="pl-4 space-y-3">
                    <p>
                      <span className="font-semibold">(i)</span> The Company has
                      the right to process Personal Data in order to support,
                      promote and realize our relations.
                    </p>
                    <p>
                      <span className="font-semibold">(ii)</span> The Company
                      will not communicate or disclose such Personal Data to any
                      third party, unless pertaining to: (1) a company/companies
                      to which the Company has partly or fully assigned the
                      realization of the processing of such data in accordance
                      with the law, (2) such communication or disclosure which
                      may be required by law or by a court decision and (3)
                      where I am a client of the Company according to the
                      Privacy Policy which also applies to me.
                    </p>
                    <p>
                      <span className="font-semibold">(iii)</span> Unless
                      otherwise specifically instructed by me, the Company will
                      have the right to use such personal data, with the
                      exception of Sensitive Personal Data, in order to remotely
                      promote its financial products and/or any
                      products/services provided by other affiliated companies.
                    </p>
                    <p>
                      <span className="font-semibold">(iv)</span> The above will
                      apply both to current Clients of the Company and to
                      applicants for any service, irrespective of whether their
                      application may be accepted or rejected. Regarding the
                      clients of the Company, the Privacy Policy also applies.
                    </p>
                  </div>
                </div>
              </section>

              {/* Governing Law */}
              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Governing Law
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  Use of this site shall be governed by Laws of Washington DC.
                </p>
              </section>

              {/* Agreement */}
              <section className="bg-orange-500/10 border border-orange-500 rounded-lg p-6 md:p-8">
                <p className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                  By accessing the Company`s website and any pages linked
                  thereto, I agree to be bound by the terms and conditions as
                  described above.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
