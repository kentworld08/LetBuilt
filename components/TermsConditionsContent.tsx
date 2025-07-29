import HeroBanner from "@/lib/HeroBanner";
import { limitations, cookies } from "@/constants/Data";

export function TermsConditionsContent() {
  return (
    <div className="bg-gray-900 text-white">
      <HeroBanner
        title1="Terms &"
        title2="Conditions"
        sub="TERMS & CONDITIONS"
      />

      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                LetBuilt
              </h2>
            </div>

            <div className="space-y-8 md:space-y-12">
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

              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Limitation of Liability
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
                  {limitations.map((limit, index) => (
                    <p key={index}>{limit}</p>
                  ))}
                </div>
              </section>

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

              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Cookies
                </h3>
                <div className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4">
                  {cookies.map((cookie, index) => (
                    <p key={index}>{cookie}</p>
                  ))}

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

              <section className="bg-gray-800 rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4 md:mb-6">
                  Governing Law
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  Use of this site shall be governed by Laws of Washington DC.
                </p>
              </section>

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
